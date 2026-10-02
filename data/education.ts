export type Education = {
  id: string;
  institution: string;
  shortName: string;
  degree: string;
  start: string;
  end: string;
  location: string;
  status?: string;
  note?: string;
};

export const education: Education[] = [
  {
    id: "tu-dresden",
    institution: "Technische Universität Dresden",
    shortName: "TU Dresden",
    degree: "M.Sc. Computational Modeling and Simulation",
    start: "Oct 2026",
    end: "Sep 2028 (Expected)",
    location: "Dresden, Germany",
    status: "Current",
  },
  {
    id: "mjcet",
    institution: "Muffakham Jah College of Engineering and Technology",
    shortName: "MJCET",
    degree: "B.E. Information Technology",
    start: "Sep 2021",
    end: "Jul 2025",
    location: "Hyderabad, India",
    note: "CGPA 8.13 / 10",
  },
];
