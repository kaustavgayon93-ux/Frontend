with open(r'C:\Users\kaust\.gemini\antigravity\brain\8596dd6f-c2e6-494e-9939-00ffb5907ea9\dashboard_widget.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Make it standalone-friendly with modern slate dark theme
content_web = content.replace('class="bg-transparent text-[var(--foreground)] antialiased p-3 sm:p-5"', 'class="bg-slate-950 text-slate-100 antialiased p-3 sm:p-6 min-h-screen"')
content_web = content_web.replace('bg-[var(--card)]', 'bg-slate-900')
content_web = content_web.replace('text-[var(--foreground)]', 'text-slate-100')
content_web = content_web.replace('text-[var(--muted-foreground)]', 'text-slate-400')
content_web = content_web.replace('border-[var(--border)]', 'border-slate-800')
content_web = content_web.replace('bg-[var(--background)]', 'bg-slate-950/70')

with open(r'C:\Users\kaust\.gemini\antigravity\scratch\mrvfrontend\index.html', 'w', encoding='utf-8') as f:
    f.write(content_web)

print("Successfully generated index.html for GitHub Pages")
