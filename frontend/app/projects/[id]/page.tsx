'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPatch, apiDelete } from '../../../src/lib/api';

interface Project {
  id: string;
  name: string;
  brandJson?: {
    primaryColor?: string;
    [key: string]: any;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  params: { id: string };
}

export default function ProjectDetailPage({ params }: Props) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');

  useEffect(() => {
    loadProject();
  }, [params.id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Project>(`/api/projects/${params.id}`);
      setProject(data);
      setName(data.name);
      setPrimaryColor(data.brandJson?.primaryColor || '');
    } catch (err: any) {
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      const updateData = {
        name,
        brandJson: {
          ...project?.brandJson,
          primaryColor: primaryColor || undefined,
        },
      };
      
      const updatedProject = await apiPatch<Project>(`/api/projects/${params.id}`, updateData);
      setProject(updatedProject);
      setSuccessMessage('Project updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleting(true);
      setError(null);
      
      await apiDelete(`/api/projects/${params.id}`);
      router.push('/projects');
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '200px' 
      }}>
        <div>Loading project...</div>
      </div>
    );
  }

  if (!project && !loading) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ color: '#dc3545', marginBottom: '20px' }}>
          {error || 'Project not found'}
        </div>
        <button 
          onClick={() => router.push('/projects')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => router.push('/projects')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Back to Projects
        </button>
        
        <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>Edit Project</h1>
        <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
          Project ID: {project?.id}
        </p>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {successMessage && (
        <div style={{
          padding: '12px',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            fontSize: '14px' 
          }}>
            Project Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter project name"
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            fontSize: '14px' 
          }}>
            Primary Color
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={primaryColor || '#000000'}
              onChange={(e) => setPrimaryColor(e.target.value)}
              style={{
                width: '50px',
                height: '40px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="#000000 or color name"
            />
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '12px 24px',
              backgroundColor: saving ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            style={{
              padding: '12px 24px',
              backgroundColor: deleting ? '#6c757d' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: deleting ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {deleting ? 'Deleting...' : 'Delete Project'}
          </button>
        </div>
      </form>

      {project && (
        <div style={{ 
          marginTop: '40px', 
          padding: '16px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          fontSize: '14px' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Project Info</h3>
          <p style={{ margin: '5px 0' }}>
            <strong>Created:</strong> {new Date(project.createdAt).toLocaleString()}
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Updated:</strong> {new Date(project.updatedAt).toLocaleString()}
          </p>
          {project.brandJson && Object.keys(project.brandJson).length > 1 && (
            <details style={{ marginTop: '10px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Brand JSON Data
              </summary>
              <pre style={{ 
                marginTop: '10px', 
                padding: '10px', 
                backgroundColor: 'white', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {JSON.stringify(project.brandJson, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
