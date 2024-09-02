export const shuffleIndices = (length: number): number[] => {
  return (
    new Array(length)
      .fill(0) // Create an array of the specified length filled with zeros
      .map((_, i) => i) // Replace each element with its index value [0, 1, 2, ..., length-1]
      // Create an array of objects with 'value' as the index and 'sort' as a random number
      .map((value) => ({ value, sort: Math.random() }))
      // Sort the array based on the 'sort' property to randomize the order
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value) // Extract the 'value' property to get the shuffled indices
  );
};
