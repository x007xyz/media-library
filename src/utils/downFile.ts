
/**
 * Downloads a file from the given URL with the specified filename.
 *
 * @param url - The URL of the file to download.
 * @param filename - The desired filename for the downloaded file.
 */
export default function downFile(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}