const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const newHandler = `
  const handleTaskClick = async (task: string) => {
    setSelectedTask(task);
    setQuickReviewContent(null);
    setIsReviewLoading(true);
    try {
      const response = await fetch('/api/quick-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
      });
      if (response.ok) {
        const data = await response.json();
        setQuickReviewContent(data.reviewContent);
      }
    } catch (error) {
      console.error("Failed to fetch quick review", error);
    } finally {
      setIsReviewLoading(false);
    }
  };

  const handleDownloadPdf`;

code = code.replace('  const handleDownloadPdf', newHandler);
fs.writeFileSync('src/components/ReportView.tsx', code);
console.log(code.includes('handleTaskClick'));
