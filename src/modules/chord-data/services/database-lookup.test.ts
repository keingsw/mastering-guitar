import { describe, test, expect } from 'vitest';
import {
  getTriad,
  getTriadsByRoot,
  getTriadsByQuality,
  getVoicingsByDifficulty,
  getVoicingsByNeckPosition,
  findTriads,
  findVoicings,
  getRandomTriad,
  getCommonVoicings,
  getDatabaseStats,
  getAllTriadSymbols,
} from './database-lookup';

describe('Database lookup', () => {
  describe('getTriad', () => {
    test('retrieves specific triad from database', () => {
      const cMajor = getTriad('C', 'major');
      expect(cMajor).toBeDefined();
      expect(cMajor?.triad.root.name).toBe('C');
      expect(cMajor?.triad.quality).toBe('major');
      expect(cMajor?.triad.symbol).toBe('C');
    });

    test('returns null for invalid combinations', () => {
      const invalid = getTriad('C' as any, 'invalid' as any);
      expect(invalid).toBeNull();
    });
  });

  describe('getTriadsByRoot', () => {
    test('returns all triads for a root note', () => {
      const cTriads = getTriadsByRoot('C');
      expect(cTriads).toHaveLength(4);
      
      const qualities = cTriads.map(t => t.triad.quality);
      expect(qualities).toContain('major');
      expect(qualities).toContain('minor');
      expect(qualities).toContain('diminished');
      expect(qualities).toContain('augmented');
    });
  });

  describe('getTriadsByQuality', () => {
    test('returns all triads of a specific quality', () => {
      const majorTriads = getTriadsByQuality('major');
      expect(majorTriads).toHaveLength(12);
      
      majorTriads.forEach(triad => {
        expect(triad.triad.quality).toBe('major');
      });
    });
  });

  describe('findTriads', () => {
    test('finds triads with root and quality filters', () => {
      const results = findTriads({ root: 'C', quality: 'major' });
      expect(results).toHaveLength(1);
      expect(results[0].triad.symbol).toBe('C');
    });

    test('finds triads with only root filter', () => {
      const results = findTriads({ root: 'G' });
      expect(results).toHaveLength(4);
    });

    test('finds triads with only quality filter', () => {
      const results = findTriads({ quality: 'minor' });
      expect(results).toHaveLength(12);
    });
  });

  describe('findVoicings', () => {
    test('finds voicings with difficulty filter', () => {
      const beginnerVoicings = findVoicings({ 
        root: 'C', 
        quality: 'major', 
        difficulty: 'beginner' 
      });
      
      expect(beginnerVoicings.length).toBeGreaterThan(0);
      beginnerVoicings.forEach(voicing => {
        expect(voicing.difficulty).toBe('beginner');
      });
    });

    test('finds voicings with neck position filter', () => {
      const openVoicings = findVoicings({ 
        neckPosition: 0 
      });
      
      expect(openVoicings.length).toBeGreaterThan(0);
      openVoicings.forEach(voicing => {
        expect(voicing.neckPosition).toBe(0);
      });
    });

    test('finds voicings with fret limit', () => {
      const lowFretVoicings = findVoicings({ 
        maxFrets: 3 
      });
      
      expect(lowFretVoicings.length).toBeGreaterThan(0);
      lowFretVoicings.forEach(voicing => {
        expect(voicing.positions.every(p => p.fret <= 3)).toBe(true);
      });
    });
  });

  describe('getRandomTriad', () => {
    test('returns random triad', () => {
      const random1 = getRandomTriad();
      const random2 = getRandomTriad();
      
      expect(random1).toBeDefined();
      expect(random2).toBeDefined();
      expect(random1?.triad).toBeDefined();
      expect(random2?.triad).toBeDefined();
    });

    test('returns random triad of specific quality', () => {
      const randomMinor = getRandomTriad({ quality: 'minor' });
      expect(randomMinor?.triad.quality).toBe('minor');
    });
  });

  describe('getCommonVoicings', () => {
    test('returns common voicings for chord', () => {
      const commonVoicings = getCommonVoicings('C', 'major');
      expect(commonVoicings.length).toBeGreaterThan(0);
      
      commonVoicings.forEach(voicing => {
        expect(['beginner', 'intermediate']).toContain(voicing.difficulty);
      });
    });
  });

  describe('getDatabaseStats', () => {
    test('returns database statistics', () => {
      const stats = getDatabaseStats();
      
      expect(stats.totalTriads).toBe(48);
      expect(stats.totalVoicings).toBeGreaterThan(0);
      expect(stats.totalPositions).toBeGreaterThan(0);
      expect(stats.version).toBeDefined();
      expect(stats.generated).toBeDefined();
      expect(stats.instrument).toBe('guitar');
    });
  });

  describe('getAllTriadSymbols', () => {
    test('returns all chord symbols', () => {
      const symbols = getAllTriadSymbols();
      
      expect(symbols.length).toBeGreaterThan(0);
      expect(symbols).toContain('C');
      expect(symbols).toContain('Cm');
      expect(symbols).toContain('C°');
      expect(symbols).toContain('C+');
      
      expect(symbols.every(s => typeof s === 'string')).toBe(true);
    });
  });

  describe('Input Validation', () => {
    test('getTriad validates note names and qualities', () => {
      expect(getTriad('InvalidNote' as any, 'major')).toBeNull();
      expect(getTriad('C', 'invalidQuality' as any)).toBeNull();
      expect(getTriad(null as any, 'major')).toBeNull();
      expect(getTriad('C', null as any)).toBeNull();
    });

    test('getTriadsByRoot validates note names', () => {
      expect(getTriadsByRoot('InvalidNote' as any)).toEqual([]);
      expect(getTriadsByRoot(null as any)).toEqual([]);
      expect(getTriadsByRoot(undefined as any)).toEqual([]);
    });

    test('getTriadsByQuality validates quality types', () => {
      expect(getTriadsByQuality('invalidQuality' as any)).toEqual([]);
      expect(getTriadsByQuality(null as any)).toEqual([]);
      expect(getTriadsByQuality(undefined as any)).toEqual([]);
    });

    test('getVoicingsByDifficulty validates difficulty levels', () => {
      expect(getVoicingsByDifficulty('expert' as any)).toEqual([]);
      expect(getVoicingsByDifficulty(null as any)).toEqual([]);
      expect(getVoicingsByDifficulty(undefined as any)).toEqual([]);
    });

    test('getVoicingsByNeckPosition validates position numbers', () => {
      expect(getVoicingsByNeckPosition(-1)).toEqual([]);
      expect(getVoicingsByNeckPosition(25)).toEqual([]);
      expect(getVoicingsByNeckPosition(null as any)).toEqual([]);
      expect(getVoicingsByNeckPosition('invalid' as any)).toEqual([]);
    });

    test('getRandomTriad validates quality option', () => {
      expect(getRandomTriad({ quality: 'invalidQuality' as any })).toBeNull();
      // null quality should work (returns any triad)
      expect(getRandomTriad({ quality: null as any })).toBeDefined();
    });

    test('getCommonVoicings validates both parameters', () => {
      expect(getCommonVoicings('InvalidNote' as any, 'major')).toEqual([]);
      expect(getCommonVoicings('C', 'invalidQuality' as any)).toEqual([]);
      expect(getCommonVoicings(null as any, null as any)).toEqual([]);
    });
  });
});