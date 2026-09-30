/*
 * IMPORTANTE:
 * El enunciado entregado exige calcular score/priority, pero no incluye
 * las reglas numéricas concretas. Por eso esta implementación usa una
 * REGLA EXPLÍCITA Y FÁCIL DE CAMBIAR:
 *
 * +50 si cumple los años mínimos de experiencia.
 * +10 por cada año completo que supere el mínimo (máximo +30).
 * +20 si la fuente es REFERRAL.
 *
 * HIGH   >= 80
 * MEDIUM >= 50
 * LOW    < 50
 *
 * Si tu profesor entregó otra tabla de puntos, cambia SOLO este archivo.
 */

export function calculatePriority(candidate, vacancy, source) {
  const experienceGap = candidate.yearsExperience - vacancy.minYearsExperience;

  let score = 0;

  if (experienceGap >= 0) score += 50;
  if (experienceGap > 0) score += Math.min(30, Math.floor(experienceGap) * 10);
  if (source === 'REFERRAL') score += 20;

  let priority = 'LOW';
  if (score >= 80) priority = 'HIGH';
  else if (score >= 50) priority = 'MEDIUM';

  return { score, priority };
}
