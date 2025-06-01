export const getConnectionQualityColor = (quality: string) => {
  switch (quality) {
    case "excellent":
      return "bg-green-500";
    case "good":
      return "bg-yellow-500";
    case "poor":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
