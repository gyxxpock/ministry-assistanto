import { Injectable } from "@angular/core";

@Injectable()
export class FileUtilService {
  
  /**
   * Descarga un archivo en el navegador
   * @param content Contenido del archivo (string)
   * @param fileName Nombre del archivo con extensión
   * @param contentType Tipo MIME (ej: 'application/json')
   */
  downloadFile(content: string, fileName: string, contentType: string): void {
    try {
      const blob = new Blob([content], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // Aseguramos que el link no sea visible y lo disparamos
      document.body.appendChild(link);
      link.click();
      
      // Limpieza del DOM
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al intentar descargar el archivo:', error);
    }
  }

  /**
   * Lee un archivo seleccionado por el usuario
   * @param file Objeto File del input
   * @returns Promesa con el contenido del archivo como string
   */
  readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }
}
