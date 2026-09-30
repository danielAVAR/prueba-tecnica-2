import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePriority } from '../src/services/priority.service.js';

const candidate = years => ({ yearsExperience: years });
const vacancy = years => ({ minYearsExperience: years });

test('candidate that meets requirement gets at least MEDIUM priority', () => {
  const result = calculatePriority(candidate(3), vacancy(3), 'OTHER');
  assert.equal(result.score, 50);
  assert.equal(result.priority, 'MEDIUM');
});

test('REFERRAL plus experience above requirement can reach HIGH', () => {
  const result = calculatePriority(candidate(6), vacancy(3), 'REFERRAL');
  assert.equal(result.score, 100);
  assert.equal(result.priority, 'HIGH');
});

test('candidate below experience requirement without referral gets LOW', () => {
  const result = calculatePriority(candidate(1), vacancy(3), 'OTHER');
  assert.equal(result.score, 0);
  assert.equal(result.priority, 'LOW');
});
