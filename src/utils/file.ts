export const downloadFile = (res: any) => {
  const reader = new FileReader();
  reader.addEventListener('loadend', () => {
    let fileName = '未知文件';

    const contentDisposition = res.headers['content-disposition'];

    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (fileNameMatch) {
        fileName = decodeURIComponent(fileNameMatch[1]).replace(/\+/g, ' ');
      }
    }

    const blob = new Blob([res.data], { type: 'application/octet-stream;charset=utf-8' });
    const URL = window.URL || window.webkitURL;
    const objectUrl = URL.createObjectURL(blob);

    if (typeof (window.navigator as any)['msSaveBlob'] !== 'undefined') {
      (window.navigator as any).msSaveBlob(blob, fileName);
    } else {
      const downloadElement = document.createElement('a');

      if (typeof downloadElement.download !== 'undefined') {
        downloadElement.href = objectUrl;
        downloadElement.download = fileName;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        downloadElement.remove();
      } else {
        window.location.href = objectUrl;
      }

      URL.revokeObjectURL(objectUrl);
    }
  });
  reader.readAsText(res.data);
};
