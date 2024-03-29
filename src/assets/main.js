timeLine.type = timeLine.types.IMPERATIVE;
timeLine.beatsPerMinute = 90;
timeLine.nc = 4;
timeLine.dc = 4;
timeLine.startTimeMs = 0;
timeLine.endTimeMs = undefined;
timeLine.volume = 50;

let volume = 50;

async function setup() {

  let bassGuitar = await instrument.import("bass-guitar/C1.wav");

  timeLine.print("Part one");
  timeLine.play(0,bassGuitar, "B4", 1, volume);
  timeLine.play(0,bassGuitar, "D5", 1, volume);
  timeLine.play(0,bassGuitar, "D5", 1/2, volume);
  timeLine.play(0,bassGuitar, "E5", 1/2, volume);
  timeLine.play(0,bassGuitar, "E5", 1, volume);
  timeLine.play(0,bassGuitar, "G5", 2/9, volume);
  timeLine.play(0,bassGuitar, "F5", 2/9, volume);
  timeLine.play(0,bassGuitar, "G5", 1/5, volume);
  timeLine.play(0,bassGuitar, "F5", 1/4, volume);
  timeLine.play(0,bassGuitar, "G5", 1/4, volume);
  timeLine.play(0,bassGuitar, "F5", 1/4, volume);
  timeLine.play(0,bassGuitar, "D5", 1/2, volume);
  timeLine.play(0,bassGuitar, "D5", 1/2, volume);
  timeLine.play(0,bassGuitar, "E5", 1/2, volume);
  timeLine.play(0,bassGuitar, "E5", 1, volume);
  timeLine.print("Part two");
  timeLine.play(0,bassGuitar, "B4", 1, volume);
  timeLine.play(0,bassGuitar, "D5", 1, volume);
  timeLine.play(0,bassGuitar, "D5", 1/2, volume);
  timeLine.play(0,bassGuitar, "E5", 1/2, volume);
  timeLine.play(0,bassGuitar, "E5", 1, volume);
  timeLine.play(0,bassGuitar, "G5", 2/9, volume);
  timeLine.play(0,bassGuitar, "F5", 2/9, volume);
  timeLine.play(0,bassGuitar, "G5", 1/5, volume);
  timeLine.play(0,bassGuitar, "F5", 1/4, volume);
  timeLine.play(0,bassGuitar, "G5", 1/4, volume);
  timeLine.play(0,bassGuitar, "F5", 1/4, volume);
  timeLine.play(0,bassGuitar, "D5", 1/2, volume);
  timeLine.play(0,bassGuitar, "D5", 1/2, volume);
  timeLine.play(0,bassGuitar, "E5", 1/2, volume);
  timeLine.play(0,bassGuitar, "E5", 1/2, volume);
  timeLine.print("Part three");
  timeLine.play(0,bassGuitar, "B4", 1/2, volume);
  timeLine.play(0,bassGuitar, "B4", 1/2, volume);
  timeLine.play(0,bassGuitar, "D5", 1/2, volume);
  timeLine.play(0,bassGuitar, "B4", 1, volume);
  timeLine.play(0,bassGuitar, "A4", 1, volume);
  timeLine.play(0,bassGuitar, "A4", 2, volume);
  timeLine.play(0,bassGuitar, "B4", 1/2, volume);
  timeLine.play(0,bassGuitar, "B4", 1/2, volume);
  timeLine.play(0,bassGuitar, "D5", 1/2, volume);
  timeLine.play(0,bassGuitar, "B4", 1, volume);
  timeLine.play(0,bassGuitar, "A4", 1, volume);
  timeLine.play(0,bassGuitar, "A4", 3/2, volume);
  timeLine.print("Part four");
  timeLine.play(0,bassGuitar, "E4", 1/2, volume);
  timeLine.play(0,bassGuitar, "G4", 1/2, volume);
  timeLine.play(0,bassGuitar, "A4", 1/2, volume);
  timeLine.play(0,bassGuitar, "A4", 1, volume);
  timeLine.play(0,bassGuitar, "B4", 1/2, volume);
  timeLine.play(0,bassGuitar, "D5", 1/2, volume);
  timeLine.play(0,bassGuitar, "B4", 1/2, volume);
  timeLine.play(0,bassGuitar, "A4", 1, volume);
  timeLine.play(0,bassGuitar, "A4", 1, volume);
  timeLine.print("Part five");
  timeLine.play(0,bassGuitar, "D5", 1/2, volume);
  timeLine.play(0,bassGuitar, "E5", 1/2, volume);
  timeLine.play(0,bassGuitar, "E5", 1, volume);
  timeLine.play(0,bassGuitar, "G5", 2/9, volume);
  timeLine.play(0,bassGuitar, "F5", 2/9, volume);
  timeLine.play(0,bassGuitar, "G5", 1/5, volume);
  timeLine.play(0,bassGuitar, "F5", 1/4, volume);
  timeLine.play(0,bassGuitar, "G5", 1/4, volume);
  timeLine.play(0,bassGuitar, "F5", 1/4, volume);
  timeLine.play(0,bassGuitar, "D5", 1/2, volume);
  timeLine.play(0,bassGuitar, "D5", 1/2, volume);
  timeLine.play(0,bassGuitar, "E5", 1/2, volume);
  timeLine.play(0,bassGuitar, "E5", 1, volume);
  
  
  
  
}
