$(document).ready(function() {
    let creativity = 'medium';
    let language = 'auto';
    const toast = new bootstrap.Toast(document.getElementById('notification-toast'));
    
    // إدارة أزرار مستوى الإبداع
    $('.creativity-btn').click(function() {
        $('.creativity-btn').removeClass('active');
        $(this).addClass('active');
        creativity = $(this).data('value');
    });
    
    // إدارة أزرار اللغة
    $('.language-btn').click(function() {
        $('.language-btn').removeClass('active');
        $(this).addClass('active');
        language = $(this).data('value');
    });
    
    // توليد الأفكار
    $('#generate-btn').click(function() {
        const prompt = $('#prompt').val().trim();
        
        if (prompt.length < 10) {
            showNotification('الرجاء إدخال وصف مفصل (10 أحرف على الأقل)', 'danger');
            return;
        }
        
        // إظهار قسم التحميل وإخفاء النتائج
        $('#loader-section').removeClass('d-none');
        $('#results-section').addClass('d-none');
        
        // محاكاة شريط التقدم
        simulateProgress();
        
        // إرسال الطلب إلى الخادم
        $.ajax({
            url: '/generate',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                prompt: prompt,
                creativity: creativity,
                language: language
            }),
            success: function(response) {
                displayResults(response);
            },
            error: function(xhr) {
                $('#loader-section').addClass('d-none');
                const errorMsg = xhr.responseJSON?.error || 'حدث خطأ أثناء التوليد';
                showNotification(errorMsg, 'danger');
            }
        });
    });
    
    // نسخ النتائج
    $('#copy-btn').click(function() {
        const text = $('#ideas-container').text();
        navigator.clipboard.writeText(text).then(() => {
            const copyNotification = $('#copy-notification');
            copyNotification.removeClass('d-none');
            setTimeout(() => copyNotification.addClass('d-none'), 3000);
        });
    });
    
    // محاكاة شريط التقدم
    function simulateProgress() {
        let progress = 0;
        const progressMessages = [
            "جاري تحليل المدخلات...",
            "جاري استخلاص الأفكار الإبداعية...",
            "جاري تحسين النتائج...",
            "جاري التوليد النهائي..."
        ];
        
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 10) + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            
            $('#progress-bar').css('width', `${progress}%`).text(`${progress}%`);
            
            // تحديث الرسالة كل 25%
            if (progress < 100) {
                const messageIndex = Math.floor(progress / 25);
                $('#progress-message').text(progressMessages[messageIndex]);
            }
        }, 300);
    }
    
    // عرض النتائج
    function displayResults(data) {
        $('#loader-section').addClass('d-none');
        $('#ideas-container').empty();
        
        data.ideas.forEach((idea, index) => {
            $('#ideas-container').append(`
                <div class="idea-card">
                    <h5><i class="fa-regular fa-lightbulb me-2 text-warning"></i> الفكرة ${index + 1}</h5>
                    <p>${idea}</p>
                </div>
            `);
        });
        
        $('#results-section').removeClass('d-none');
        showNotification('تم توليد الأفكار بنجاح!', 'success');
        
        // تحديث رصيد المستخدم
        $.get("/user/credits", function(data) {
            $('#credits-count').text(data.credits);
        });
    }
    
    // عرض الإشعارات
    function showNotification(message, type) {
        const toastBody = $('.toast-body');
        const toastHeader = $('.toast-header');
        
        toastBody.text(message);
        toastHeader.removeClass('bg-success bg-danger bg-warning');
        
        if (type === 'success') {
            toastHeader.addClass('bg-success text-white');
            toastBody.addClass('text-success');
        } else if (type === 'danger') {
            toastHeader.addClass('bg-danger text-white');
            toastBody.addClass('text-danger');
        } else {
            toastHeader.addClass('bg-primary text-white');
            toastBody.addClass('text-primary');
        }
        
        toast.show();
    }
});