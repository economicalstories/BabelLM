import html2canvas from 'html2canvas';

interface ShareData {
  question: string;
  results: Array<{
    flagCode: string;
    text: string;
    score: number;
  }>;
}

export const generateShareImage = async (elementRef: HTMLElement): Promise<string> => {
  try {
    const canvas = await html2canvas(elementRef, {
      useCORS: true, // For flag images
      logging: false,
      width: elementRef.offsetWidth * 2,
      height: elementRef.offsetHeight * 2
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

export const shareToTwitter = (imageUrl: string, data: ShareData) => {
  // Twitter doesn't support direct image upload via URL, so we'll just share text
  const text = `I perfectly matched BabelLM's translation ranking! 🎯\n\nQuestion: "${data.question}"\n\nTry it yourself at babellm.ai`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

export const shareToLinkedIn = (imageUrl: string, data: ShareData) => {
  // LinkedIn sharing API doesn't support direct image upload, using text only
  const text = `I perfectly matched BabelLM's translation ranking! 🎯\n\nQuestion: "${data.question}"`;
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

export const shareToFacebook = (imageUrl: string) => {
  // Facebook sharing API doesn't support direct image upload, using URL only
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
  window.open(url, '_blank');
};

export const downloadImage = (imageUrl: string) => {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'babellm-perfect-match.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 