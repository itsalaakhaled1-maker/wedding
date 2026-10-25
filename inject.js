const fs = require('fs');
const filePath = './index.html';

const scriptTag = `
<script>
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIgb9Zn8kP3nSjIb_oW6LXXBek6UqLbXjvGSuGQlW1J1kpjd-DVUFGMQZhBCsL3sjTMA/exec";
  
  document.addEventListener("DOMContentLoaded", function () {
    const rsvpSection = document.getElementById("rsvp");
    if (!rsvpSection) return;
    
    const form = rsvpSection.querySelector("form");
    if (!form) return;

    // استخدام التقاط الحدث مع إيقاف أي أكواد أخرى (مثل Supabase)
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      e.stopImmediatePropagation(); // هذا السطر يمنع إرسال البيانات إلى Supabase تماماً
      
      const submitButton = form.querySelector("button[type='submit']");
      const originalContent = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.textContent = "جاري الإرسال...";

      const name = form.querySelector("#name").value;
      const message = form.querySelector("#message").value;

      try {
        await fetch(SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name, message: message }),
        });

        form.innerHTML = "<div class=\"text-center text-gold py-8\" style=\"font-family: 'Amiri', serif; font-size: 1.25rem;\">✨ شكرًا لك! تم استلام تأكيد حضورك بنجاح.</div>";
      } catch (error) {
        console.error("Error:", error);
        alert("حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.");
        submitButton.disabled = false;
        submitButton.innerHTML = originalContent;
      }
    }, true); // وضع true لإعطاء الأولوية المطلقة لكود شيت جوجل
  });
</script>
`;

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) throw err;

  // تنظيف أي نسخة قديمة وإعادة الحقن بشكل سليم
  let cleanData = data.replace(scriptTag, '').replace(/<\/body>/gi, '').replace(/<\/html>/gi, '').trim();
  const finalHtml = `${cleanData}\n${scriptTag}\n</body>\n</html>`;

  fs.writeFile(filePath, finalHtml, 'utf8', (err) => {
    if (err) throw err;
    console.log('تم حقن سكريبت شيت جوجل وإلغاء Supabase بنجاح تام!');
  });
});