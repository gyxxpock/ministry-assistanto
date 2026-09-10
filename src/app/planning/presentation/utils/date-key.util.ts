/**
 * Convierte una Date a 'YYYY-MM-DD' en horario local.
 * Duplicado intencional (mismo criterio que planning/domain/planning.usecase.ts#toIsoDate
 * y time-entry/presentation/utils/date.utils.ts#toDateKey): la presentación de Planning
 * no debe importar utilidades de otro feature (time-entry) ni depender de domain/ más
 * allá de tipos, así que esta pequeña función vive localmente.
 */
export function toDateKey(date: Date): string {
  return (
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0')
  );
}
