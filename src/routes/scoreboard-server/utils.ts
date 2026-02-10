export const getPeriodName = (period: number, periodCount: number) => {
  if (periodCount === 2) {
    switch (period) {
      case 1:
        return "H1";
      case 2:
        return "H2";
      case 3:
        return "GG";
      case 4:
        return "Penalty Shootout";
    }
  }

  if (periodCount === 4) {
    switch (period) {
      case 1:
        return "Q1";
      case 2:
        return "Q2";
      case 3:
        return "Q3";
      case 4:
        return "Q4";
      case 5:
        return "GG";
      case 6:
        return "Penalty Shootout";
    }
  }

  return period.toString();
};

// export const getPeriodCount = (period: string) => {
//   switch (period) {
//     case "Q1":
//       return { period: 1, period_count: 4 };
//     case "Q2":
//       return { period: 1, period_count: 4 };
//     case "Q3":
//       return { period: 1, period_count: 4 };
//     case "Q4":
//       return { period: 1, period_count: 4 };
//     case "GG":
//       return { period: 1, period_count: 4 };

//     case "H1":
//       return { period: 1, period_count: 4 };
//     case "H2":
//       return { period: 1, period_count: 4 };
//     case "GG":
//       return { period: 1, period_count: 4 };
//     case "Q1":
//       return { period: 1, period_count: 4 };
//   }
// };
