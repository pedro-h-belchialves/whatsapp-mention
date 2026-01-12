// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fileToBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}
