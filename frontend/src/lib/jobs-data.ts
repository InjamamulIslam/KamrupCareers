export type Job = {
  id: string;
  company: string;
  position: string;
  salary: string;
  experience: string;
  location: string;
  category: string;
  type: string;
  posted: string;
};

export const JOBS: Job[] = [
  {
    id: "j1",
    company: "Brahmaputra Retail Pvt. Ltd.",
    position: "Front Desk Receptionist",
    salary: "₹15,000 – ₹18,000",
    experience: "Fresher welcome",
    location: "GS Road, Guwahati",
    category: "Receptionist",
    type: "Full-time",
    posted: "2 days ago",
  },
  {
    id: "j2",
    company: "Assam Skyline Hospitality",
    position: "HR Executive",
    salary: "₹22,000 – ₹28,000",
    experience: "1–3 years",
    location: "Zoo Road, Guwahati",
    category: "HR",
    type: "Full-time",
    posted: "3 days ago",
  },
  {
    id: "j3",
    company: "Kamakhya Tele Solutions",
    position: "Customer Support Executive",
    salary: "₹14,000 – ₹17,000",
    experience: "Fresher welcome",
    location: "Beltola, Guwahati",
    category: "Telecaller",
    type: "Full-time",
    posted: "1 day ago",
  },
  {
    id: "j4",
    company: "NorthEast Traders",
    position: "Accountant (Tally)",
    salary: "₹18,000 – ₹25,000",
    experience: "1+ years",
    location: "Fancy Bazaar, Guwahati",
    category: "Accountant",
    type: "Full-time",
    posted: "5 days ago",
  },
  {
    id: "j5",
    company: "Rhino Sales & Marketing",
    position: "Field Sales Executive",
    salary: "₹16,000 + Incentives",
    experience: "Fresher welcome",
    location: "Guwahati (Field)",
    category: "Sales",
    type: "Full-time",
    posted: "4 days ago",
  },
  {
    id: "j6",
    company: "Digital Guwahati Media",
    position: "Computer Operator",
    salary: "₹12,000 – ₹15,000",
    experience: "12th Pass",
    location: "Ganeshguri, Guwahati",
    category: "Computer Operator",
    type: "Full-time",
    posted: "1 week ago",
  },
];

export const CATEGORIES = [
  "Receptionist",
  "Office Jobs",
  "Sales",
  "HR",
  "Accountant",
  "Telecaller",
  "Computer Operator",
  "Hospitality",
  "Retail",
  "IT",
  "Marketing",
];
