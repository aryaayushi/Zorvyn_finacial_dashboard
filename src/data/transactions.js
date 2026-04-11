// Initial seed data for the finance dashboard
// Today = 2026-04-11. Data spans last ~12 months for all chart views.

function daysAgo(n) {
  const d = new Date('2026-04-11');
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

export const initialTransactions = [
  // ── Last 7 Days ──────────────────────────────────────────
  { id: 101, date: daysAgo(0), category: 'Freelance', type: 'Income',  amount: 4200 },
  { id: 102, date: daysAgo(0), category: 'Food',      type: 'Expense', amount: 650  },
  { id: 103, date: daysAgo(1), category: 'Transport', type: 'Expense', amount: 400  },
  { id: 104, date: daysAgo(1), category: 'Salary',    type: 'Income',  amount: 45000},
  { id: 105, date: daysAgo(2), category: 'Shopping',  type: 'Expense', amount: 3200 },
  { id: 106, date: daysAgo(2), category: 'Food',      type: 'Expense', amount: 520  },
  { id: 107, date: daysAgo(3), category: 'Utilities', type: 'Expense', amount: 1800 },
  { id: 108, date: daysAgo(3), category: 'Investment',type: 'Income',  amount: 8000 },
  { id: 109, date: daysAgo(4), category: 'Rent',      type: 'Expense', amount: 16000},
  { id: 110, date: daysAgo(4), category: 'Food',      type: 'Expense', amount: 780  },
  { id: 111, date: daysAgo(5), category: 'Freelance', type: 'Income',  amount: 6500 },
  { id: 112, date: daysAgo(5), category: 'Healthcare',type: 'Expense', amount: 1200 },
  { id: 113, date: daysAgo(6), category: 'Education', type: 'Expense', amount: 2500 },
  { id: 114, date: daysAgo(6), category: 'Salary',    type: 'Income',  amount: 12000},

  // ── Last 30 Days (week 2) ────────────────────────────────
  { id: 201, date: daysAgo(7),  category: 'Food',       type: 'Expense', amount: 950  },
  { id: 202, date: daysAgo(7),  category: 'Freelance',  type: 'Income',  amount: 3800 },
  { id: 203, date: daysAgo(8),  category: 'Transport',  type: 'Expense', amount: 350  },
  { id: 204, date: daysAgo(9),  category: 'Shopping',   type: 'Expense', amount: 4100 },
  { id: 205, date: daysAgo(10), category: 'Food',       type: 'Expense', amount: 600  },
  { id: 206, date: daysAgo(10), category: 'Investment', type: 'Income',  amount: 5000 },
  { id: 207, date: daysAgo(11), category: 'Utilities',  type: 'Expense', amount: 900  },
  { id: 208, date: daysAgo(12), category: 'Freelance',  type: 'Income',  amount: 7200 },
  { id: 209, date: daysAgo(12), category: 'Healthcare', type: 'Expense', amount: 2200 },
  { id: 210, date: daysAgo(13), category: 'Food',       type: 'Expense', amount: 430  },

  // ── Last 30 Days (week 3) ────────────────────────────────
  { id: 301, date: daysAgo(14), category: 'Salary',     type: 'Income',  amount: 45000},
  { id: 302, date: daysAgo(14), category: 'Rent',       type: 'Expense', amount: 16000},
  { id: 303, date: daysAgo(15), category: 'Food',       type: 'Expense', amount: 710  },
  { id: 304, date: daysAgo(16), category: 'Entertainment',type:'Expense', amount: 1500},
  { id: 305, date: daysAgo(17), category: 'Transport',  type: 'Expense', amount: 480  },
  { id: 306, date: daysAgo(18), category: 'Investment', type: 'Income',  amount: 9000 },
  { id: 307, date: daysAgo(19), category: 'Shopping',   type: 'Expense', amount: 2600 },
  { id: 308, date: daysAgo(20), category: 'Food',       type: 'Expense', amount: 850  },
  { id: 309, date: daysAgo(20), category: 'Freelance',  type: 'Income',  amount: 5500 },

  // ── Last 30 Days (week 4) ────────────────────────────────
  { id: 401, date: daysAgo(21), category: 'Utilities',   type: 'Expense', amount: 1200 },
  { id: 402, date: daysAgo(22), category: 'Healthcare',  type: 'Expense', amount: 3500 },
  { id: 403, date: daysAgo(23), category: 'Food',        type: 'Expense', amount: 670  },
  { id: 404, date: daysAgo(24), category: 'Freelance',   type: 'Income',  amount: 4400 },
  { id: 405, date: daysAgo(25), category: 'Shopping',    type: 'Expense', amount: 1900 },
  { id: 406, date: daysAgo(26), category: 'Transport',   type: 'Expense', amount: 320  },
  { id: 407, date: daysAgo(27), category: 'Investment',  type: 'Income',  amount: 6000 },
  { id: 408, date: daysAgo(28), category: 'Food',        type: 'Expense', amount: 990  },
  { id: 409, date: daysAgo(29), category: 'Entertainment',type:'Expense', amount: 2200 },

  // ── 2–4 Months Ago (for 6 Months view) ──────────────────
  { id: 501, date: daysAgo(35), category: 'Salary',     type: 'Income',  amount: 45000},
  { id: 502, date: daysAgo(36), category: 'Rent',       type: 'Expense', amount: 16000},
  { id: 503, date: daysAgo(38), category: 'Food',       type: 'Expense', amount: 1100 },
  { id: 504, date: daysAgo(40), category: 'Freelance',  type: 'Income',  amount: 8500 },
  { id: 505, date: daysAgo(42), category: 'Shopping',   type: 'Expense', amount: 3300 },
  { id: 506, date: daysAgo(45), category: 'Utilities',  type: 'Expense', amount: 1600 },
  { id: 507, date: daysAgo(48), category: 'Investment', type: 'Income',  amount: 12000},
  { id: 508, date: daysAgo(50), category: 'Healthcare', type: 'Expense', amount: 2800 },
  { id: 509, date: daysAgo(55), category: 'Freelance',  type: 'Income',  amount: 6200 },
  { id: 510, date: daysAgo(60), category: 'Salary',     type: 'Income',  amount: 45000},
  { id: 511, date: daysAgo(61), category: 'Rent',       type: 'Expense', amount: 16000},
  { id: 512, date: daysAgo(63), category: 'Food',       type: 'Expense', amount: 870  },
  { id: 513, date: daysAgo(65), category: 'Shopping',   type: 'Expense', amount: 4000 },
  { id: 514, date: daysAgo(70), category: 'Transport',  type: 'Expense', amount: 620  },
  { id: 515, date: daysAgo(72), category: 'Investment', type: 'Income',  amount: 7500 },
  { id: 516, date: daysAgo(75), category: 'Entertainment',type:'Expense', amount: 1800},
  { id: 517, date: daysAgo(80), category: 'Freelance',  type: 'Income',  amount: 9200 },
  { id: 518, date: daysAgo(85), category: 'Utilities',  type: 'Expense', amount: 1400 },
  { id: 519, date: daysAgo(88), category: 'Healthcare', type: 'Expense', amount: 3000 },
  { id: 520, date: daysAgo(90), category: 'Salary',     type: 'Income',  amount: 45000},
  { id: 521, date: daysAgo(91), category: 'Rent',       type: 'Expense', amount: 16000},
  { id: 522, date: daysAgo(93), category: 'Food',       type: 'Expense', amount: 940  },

  // ── 4–12 Months Ago (for This Year view) ────────────────
  { id: 601, date: daysAgo(120), category: 'Salary',     type: 'Income',  amount: 45000},
  { id: 602, date: daysAgo(121), category: 'Rent',       type: 'Expense', amount: 16000},
  { id: 603, date: daysAgo(123), category: 'Shopping',   type: 'Expense', amount: 5500 },
  { id: 604, date: daysAgo(125), category: 'Freelance',  type: 'Income',  amount: 11000},
  { id: 605, date: daysAgo(128), category: 'Utilities',  type: 'Expense', amount: 2100 },
  { id: 606, date: daysAgo(150), category: 'Salary',     type: 'Income',  amount: 45000},
  { id: 607, date: daysAgo(152), category: 'Rent',       type: 'Expense', amount: 16000},
  { id: 608, date: daysAgo(155), category: 'Food',       type: 'Expense', amount: 1300 },
  { id: 609, date: daysAgo(158), category: 'Investment', type: 'Income',  amount: 15000},
  { id: 610, date: daysAgo(162), category: 'Healthcare', type: 'Expense', amount: 4200 },
  { id: 611, date: daysAgo(180), category: 'Salary',     type: 'Income',  amount: 45000},
  { id: 612, date: daysAgo(181), category: 'Rent',       type: 'Expense', amount: 16000},
  { id: 613, date: daysAgo(183), category: 'Entertainment',type:'Expense', amount: 3000},
  { id: 614, date: daysAgo(185), category: 'Freelance',  type: 'Income',  amount: 13500},
  { id: 615, date: daysAgo(210), category: 'Salary',     type: 'Income',  amount: 45000},
  { id: 616, date: daysAgo(211), category: 'Rent',       type: 'Expense', amount: 16000},
  { id: 617, date: daysAgo(214), category: 'Shopping',   type: 'Expense', amount: 6200 },
  { id: 618, date: daysAgo(218), category: 'Investment', type: 'Income',  amount: 18000},
  { id: 619, date: daysAgo(240), category: 'Salary',     type: 'Income',  amount: 45000},
  { id: 620, date: daysAgo(241), category: 'Rent',       type: 'Expense', amount: 16000},
  { id: 621, date: daysAgo(245), category: 'Freelance',  type: 'Income',  amount: 10000},
  { id: 622, date: daysAgo(248), category: 'Healthcare', type: 'Expense', amount: 2500 },
  { id: 623, date: daysAgo(270), category: 'Salary',     type: 'Income',  amount: 45000},
  { id: 624, date: daysAgo(271), category: 'Rent',       type: 'Expense', amount: 16000},
  { id: 625, date: daysAgo(275), category: 'Food',       type: 'Expense', amount: 1500 },
  { id: 626, date: daysAgo(278), category: 'Investment', type: 'Income',  amount: 20000},
  { id: 627, date: daysAgo(300), category: 'Salary',     type: 'Income',  amount: 45000},
  { id: 628, date: daysAgo(301), category: 'Rent',       type: 'Expense', amount: 16000},
  { id: 629, date: daysAgo(305), category: 'Shopping',   type: 'Expense', amount: 7000 },
  { id: 630, date: daysAgo(340), category: 'Salary',     type: 'Income',  amount: 45000},
  { id: 631, date: daysAgo(341), category: 'Rent',       type: 'Expense', amount: 16000},
  { id: 632, date: daysAgo(345), category: 'Freelance',  type: 'Income',  amount: 8800 },
  { id: 633, date: daysAgo(350), category: 'Utilities',  type: 'Expense', amount: 1900 },
  { id: 634, date: daysAgo(355), category: 'Healthcare', type: 'Expense', amount: 3800 },
];

export const CATEGORIES = [
  'Salary', 'Freelance', 'Investment', 'Rent', 'Food', 'Transport',
  'Utilities', 'Healthcare', 'Shopping', 'Entertainment', 'Education', 'Other'
];
