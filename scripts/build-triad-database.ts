#!/usr/bin/env tsx


import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  Note,
  generateTriad,
  getAllTriads,
  getAllTriadQualities,
  mapTriadToFretboard,
  generateChordVoicings,
  getStandardTuning,
} from '../src/modules/music-theory/index.js';
import type {
  TriadDatabase,
  TriadDatabaseEntry,
  DatabaseTriad,
  DatabaseFretboardPosition,
  DatabaseChordVoicing,
} from '../src/modules/chord-data/types/database.js';
import type { NoteName, TriadQuality } from '../src/modules/music-theory/types/music.js';

const ALL_NOTES: NoteName[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function convertToDatabase<T extends { name: NoteName; octave?: number; frequency?: number }>(note: T) {
  return {
    name: note.name,
    octave: note.octave,
    frequency: note.frequency,
  };
}

function generateTriadDatabase(): TriadDatabase {
  console.log('🎸 Building comprehensive triad database...');
  
  const database: TriadDatabase = {
    version: '1.0.0',
    generated: new Date().toISOString(),
    instrument: 'guitar',
    tuning: getStandardTuning().map(convertToDatabase),
    triads: {} as Record<NoteName, Record<TriadQuality, TriadDatabaseEntry>>,
    index: {
      byRoot: {} as Record<NoteName, TriadDatabaseEntry[]>,
      byQuality: {} as Record<TriadQuality, TriadDatabaseEntry[]>,
      byDifficulty: { beginner: [], intermediate: [], advanced: [] },
      byNeckPosition: {},
    },
    stats: {
      totalTriads: 0,
      totalVoicings: 0,
      totalPositions: 0,
      voicingsByDifficulty: { beginner: 0, intermediate: 0, advanced: 0 },
    },
  };

  const qualities = getAllTriadQualities();
  
  for (const noteName of ALL_NOTES) {
    database.triads[noteName] = {} as Record<TriadQuality, TriadDatabaseEntry>;
    database.index.byRoot[noteName] = [];
    
    for (const quality of qualities) {
      console.log(`  Processing ${noteName} ${quality}...`);
      
      const root = new Note(noteName);
      const triad = generateTriad(root, quality);
      
      const databaseTriad: DatabaseTriad = {
        root: convertToDatabase(triad.root),
        third: convertToDatabase(triad.third),
        fifth: convertToDatabase(triad.fifth),
        quality: triad.quality,
        symbol: triad.symbol,
      };
      
      const fretboardPositions = mapTriadToFretboard(triad).map(pos => ({
        string: pos.string,
        fret: pos.fret,
        note: convertToDatabase(pos.note),
        isRoot: pos.isRoot,
        isThird: pos.isThird,
        isFifth: pos.isFifth,
      }));
      
      const allVoicings = generateChordVoicings(triad);
      const databaseVoicings: DatabaseChordVoicing[] = allVoicings.map(voicing => ({
        triad: databaseTriad,
        positions: voicing.positions.map(pos => ({
          string: pos.string,
          fret: pos.fret,
          note: convertToDatabase(pos.note),
          isRoot: pos.isRoot,
          isThird: pos.isThird,
          isFifth: pos.isFifth,
        })),
        fingering: voicing.fingering,
        difficulty: voicing.difficulty,
        neckPosition: voicing.neckPosition,
        shape: generateShapeId(voicing.positions),
      }));
      
      const commonVoicings = databaseVoicings.filter(v => 
        v.difficulty === 'beginner' || (v.difficulty === 'intermediate' && v.neckPosition <= 5)
      );
      
      const entry: TriadDatabaseEntry = {
        triad: databaseTriad,
        fretboardPositions,
        voicings: databaseVoicings,
        commonVoicings,
      };
      
      database.triads[noteName][quality] = entry;
      database.index.byRoot[noteName].push(entry);
      
      if (!database.index.byQuality[quality]) {
        database.index.byQuality[quality] = [];
      }
      database.index.byQuality[quality].push(entry);
      
      for (const voicing of databaseVoicings) {
        database.index.byDifficulty[voicing.difficulty].push(voicing);
        database.stats.voicingsByDifficulty[voicing.difficulty]++;
        
        if (!database.index.byNeckPosition[voicing.neckPosition]) {
          database.index.byNeckPosition[voicing.neckPosition] = [];
        }
        database.index.byNeckPosition[voicing.neckPosition].push(voicing);
      }
      
      database.stats.totalTriads++;
      database.stats.totalVoicings += databaseVoicings.length;
      database.stats.totalPositions += fretboardPositions.length;
    }
  }
  
  console.log(`✅ Generated database with ${database.stats.totalTriads} triads, ${database.stats.totalVoicings} voicings`);
  return database;
}

function generateShapeId(positions: Array<{ string: number; fret: number }>): string {
  const sortedPositions = positions.sort((a, b) => a.string - b.string);
  return sortedPositions.map(p => `${p.string}:${p.fret}`).join('-');
}

function main() {
  try {
    console.log('🚀 Starting triad database generation...');
    
    const outputDir = join(process.cwd(), 'src/modules/chord-data/generated');
    mkdirSync(outputDir, { recursive: true });
    
    const database = generateTriadDatabase();
    
    const outputPath = join(outputDir, 'triad-database.json');
    writeFileSync(outputPath, JSON.stringify(database, null, 2));
    
    console.log(`📁 Database saved to: ${outputPath}`);
    console.log(`📊 Stats:`);
    console.log(`  - Total triads: ${database.stats.totalTriads}`);
    console.log(`  - Total voicings: ${database.stats.totalVoicings}`);
    console.log(`  - Total positions: ${database.stats.totalPositions}`);
    console.log(`  - Beginner voicings: ${database.stats.voicingsByDifficulty.beginner}`);
    console.log(`  - Intermediate voicings: ${database.stats.voicingsByDifficulty.intermediate}`);
    console.log(`  - Advanced voicings: ${database.stats.voicingsByDifficulty.advanced}`);
    
    console.log('✅ Triad database build complete!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}