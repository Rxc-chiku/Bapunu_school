/* SchoolTrack — Sample School Data */
const SCHOOL = {
  name: 'Green Valley High School',
  tagline: 'Excellence in Education',
  session: '2025–26',
};

const STUDENTS = [
  { id: 'ST001', name: 'Aarav Sharma', class: '5A', roll: 1, gender: 'M', dob: '2015-03-12', parent: 'Rajesh Sharma', phone: '98765 43210', email: 'rajesh.sharma@email.com', address: '12 Lake View Road', bus: 'Bus 3', feeDue: 2500, attendance: 94, avgMarks: 82 },
  { id: 'ST002', name: 'Priya Patel', class: '5A', roll: 2, gender: 'F', dob: '2015-07-22', parent: 'Meera Patel', phone: '98765 43211', email: 'meera.patel@email.com', address: '45 Park Street', bus: 'Bus 1', feeDue: 0, attendance: 98, avgMarks: 91 },
  { id: 'ST003', name: 'Rohan Gupta', class: '5A', roll: 3, gender: 'M', dob: '2015-01-08', parent: 'Amit Gupta', phone: '98765 43212', email: 'amit.gupta@email.com', address: '8 Hill Colony', bus: 'Bus 3', feeDue: 5000, attendance: 88, avgMarks: 76 },
  { id: 'ST004', name: 'Ananya Reddy', class: '5A', roll: 4, gender: 'F', dob: '2015-11-30', parent: 'Suresh Reddy', phone: '98765 43213', email: 'suresh.reddy@email.com', address: '22 Green Avenue', bus: 'Walk', feeDue: 1200, attendance: 96, avgMarks: 88 },
  { id: 'ST005', name: 'Vihaan Mehta', class: '5A', roll: 5, gender: 'M', dob: '2015-05-14', parent: 'Kavita Mehta', phone: '98765 43214', email: 'kavita.mehta@email.com', address: '3 River Lane', bus: 'Bus 2', feeDue: 0, attendance: 92, avgMarks: 85 },
  { id: 'ST006', name: 'Ishita Khan', class: '5A', roll: 6, gender: 'F', dob: '2015-09-03', parent: 'Imran Khan', phone: '98765 43215', email: 'imran.khan@email.com', address: '67 Market Road', bus: 'Bus 1', feeDue: 3500, attendance: 90, avgMarks: 79 },
  { id: 'ST007', name: 'Arjun Nair', class: '8B', roll: 1, gender: 'M', dob: '2012-04-18', parent: 'Deepa Nair', phone: '98765 43216', email: 'deepa.nair@email.com', address: '91 Palm Court', bus: 'Bus 4', feeDue: 0, attendance: 95, avgMarks: 87 },
  { id: 'ST008', name: 'Saanvi Joshi', class: '8B', roll: 2, gender: 'F', dob: '2012-08-25', parent: 'Nikhil Joshi', phone: '98765 43217', email: 'nikhil.joshi@email.com', address: '15 Oak Street', bus: 'Bus 2', feeDue: 1800, attendance: 93, avgMarks: 90 },
  { id: 'ST009', name: 'Kabir Singh', class: '10A', roll: 5, gender: 'M', dob: '2010-02-11', parent: 'Harpreet Singh', phone: '98765 43218', email: 'harpreet.s@email.com', address: '4 Cantonment', bus: 'Bus 5', feeDue: 0, attendance: 97, avgMarks: 93 },
  { id: 'ST010', name: 'Diya Kapoor', class: '10A', roll: 8, gender: 'F', dob: '2010-12-01', parent: 'Ritu Kapoor', phone: '98765 43219', email: 'ritu.kapoor@email.com', address: '88 Sunset Blvd', bus: 'Bus 5', feeDue: 7500, attendance: 89, avgMarks: 84 },
  { id: 'ST011', name: 'Aditya Verma', class: '3C', roll: 4, gender: 'M', dob: '2017-06-19', parent: 'Pooja Verma', phone: '98765 43220', email: 'pooja.verma@email.com', address: '31 School Lane', bus: 'Bus 1', feeDue: 0, attendance: 99, avgMarks: 78 },
  { id: 'ST012', name: 'Myra Iyer', class: '6B', roll: 7, gender: 'F', dob: '2014-10-07', parent: 'Ravi Iyer', phone: '98765 43221', email: 'ravi.iyer@email.com', address: '56 Temple Road', bus: 'Bus 4', feeDue: 2200, attendance: 91, avgMarks: 86 },
];

const TEACHERS = [
  { id: 'T001', name: 'Mrs. Sunita Rao', subject: 'Mathematics', classes: ['5A', '5B'], phone: '98111 22001', email: 'sunita.rao@greenvalley.edu', experience: '12 yrs' },
  { id: 'T002', name: 'Mr. Vikram Desai', subject: 'Science', classes: ['5A', '6B'], phone: '98111 22002', email: 'vikram.desai@greenvalley.edu', experience: '8 yrs' },
  { id: 'T003', name: 'Ms. Neha Banerjee', subject: 'English', classes: ['5A', '8B'], phone: '98111 22003', email: 'neha.b@greenvalley.edu', experience: '6 yrs' },
  { id: 'T004', name: 'Mr. Arun Pillai', subject: 'Social Studies', classes: ['8B', '10A'], phone: '98111 22004', email: 'arun.pillai@greenvalley.edu', experience: '15 yrs' },
  { id: 'T005', name: 'Mrs. Fatima Sheikh', subject: 'Hindi', classes: ['3C', '5A'], phone: '98111 22005', email: 'fatima.s@greenvalley.edu', experience: '10 yrs' },
  { id: 'T006', name: 'Mr. Daniel Thomas', subject: 'Computer Science', classes: ['8B', '10A'], phone: '98111 22006', email: 'daniel.t@greenvalley.edu', experience: '5 yrs' },
];

const CLASS_PERFORMANCE = {
  labels: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
  avgMarks: [72, 75, 78, 74, 82, 80, 77, 85, 83, 88],
  passPct: [90, 92, 95, 91, 94, 93, 89, 96, 94, 97],
};

const ATTENDANCE_OVERVIEW = { present: 382, absent: 28, late: 10, total: 420 };

const FEE_STRUCTURE = [
  { name: 'Tuition Fee', amount: 45000, period: 'Annual' },
  { name: 'Transport Fee', amount: 12000, period: 'Annual' },
  { name: 'Lab Fee', amount: 3000, period: 'Annual' },
  { name: 'Library Fee', amount: 1500, period: 'Annual' },
  { name: 'Sports Fee', amount: 2000, period: 'Annual' },
  { name: 'Exam Fee', amount: 2500, period: 'Annual' },
];

const FEE_COLLECTION = { collected: 840000, pending: 250000 };

const PARENT_FEES = {
  pending: [
    { name: 'Tuition Fee (Q2)', amount: 11250, due: '2026-04-15' },
    { name: 'Transport Fee (Apr)', amount: 1000, due: '2026-04-10' },
    { name: 'Other Charges', amount: 250, due: '2026-04-15' },
  ],
  history: [
    { name: 'Tuition Fee (Q1)', amount: 11250, paid: '2026-01-10', mode: 'UPI' },
    { name: 'Transport Fee (Jan–Mar)', amount: 3000, paid: '2026-01-10', mode: 'UPI' },
    { name: 'Exam Fee', amount: 2500, paid: '2026-02-05', mode: 'Card' },
  ],
};

const EXAM_RESULTS = {
  overall: 82,
  subjects: [
    { name: 'English', marks: 85, max: 100 },
    { name: 'Mathematics', marks: 78, max: 100 },
    { name: 'Science', marks: 88, max: 100 },
    { name: 'Social Studies', marks: 80, max: 100 },
    { name: 'Hindi', marks: 76, max: 100 },
    { name: 'Computer', marks: 90, max: 100 },
  ],
};

const NOTICES = [
  { id: 1, title: 'Parent Teacher Meeting', date: '2026-04-25', body: 'PTM scheduled for all classes from 9 AM to 1 PM in the school auditorium.', type: 'meeting' },
  { id: 2, title: 'Exam Schedule Released', date: '2026-04-18', body: 'Unit Test 2 timetable is available. Exams begin from 5 May.', type: 'exam' },
  { id: 3, title: 'Holiday on 1 May', date: '2026-04-20', body: 'School will remain closed on Labour Day. Classes resume on 2 May.', type: 'holiday' },
  { id: 4, title: 'Sports Day Registration', date: '2026-04-15', body: 'Register for annual sports day events before 28 April.', type: 'event' },
  { id: 5, title: 'Fee Payment Reminder', date: '2026-04-12', body: 'Q2 fee payment due by 15 April. Late fee applies after due date.', type: 'fee' },
];

const ACTIVITIES = [
  { text: 'Aarav Sharma marked present', time: '2 min ago', type: 'attendance' },
  { text: 'Fee payment received — Priya Patel ₹11,250', time: '15 min ago', type: 'fee' },
  { text: 'Mrs. Sunita Rao entered Math marks for 5A', time: '42 min ago', type: 'exam' },
  { text: 'New notice posted: Exam Schedule', time: '1 hr ago', type: 'notice' },
  { text: 'Bus 3 departed from school gate', time: '1 hr ago', type: 'transport' },
  { text: 'Diya Kapoor fee reminder sent', time: '2 hrs ago', type: 'fee' },
  { text: 'Rohan Gupta marked absent', time: '3 hrs ago', type: 'attendance' },
];

const BUSES = [
  { id: 'Bus 1', driver: 'Ramesh Yadav', phone: '99001 10001', route: 'North Route', students: 32, status: 'On Time', eta: '8 min' },
  { id: 'Bus 2', driver: 'Suresh Kumar', phone: '99001 10002', route: 'East Route', students: 28, status: 'On Time', eta: '12 min' },
  { id: 'Bus 3', driver: 'Manoj Singh', phone: '99001 10003', route: 'Lake View Route', students: 30, status: 'Arriving', eta: '5 min' },
  { id: 'Bus 4', driver: 'Prakash Das', phone: '99001 10004', route: 'West Route', students: 26, status: 'Delayed', eta: '18 min' },
  { id: 'Bus 5', driver: 'Anil Verma', phone: '99001 10005', route: 'South Route', students: 24, status: 'On Time', eta: '10 min' },
];

/* Generate attendance for current month — varies per student */
function generateMonthAttendance(year, month, studentId) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const seed = (studentId || 'ST001').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const absentDays = [3 + (seed % 5), 10 + (seed % 7), 17 + (seed % 4)].filter(d => d <= daysInMonth);
  const records = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const day = date.getDay();
    if (day === 0) {
      records.push({ day: d, status: 'holiday' });
      continue;
    }
    if (date > today) {
      records.push({ day: d, status: 'future' });
      continue;
    }
    if (absentDays.includes(d)) records.push({ day: d, status: 'absent' });
    else records.push({ day: d, status: 'present' });
  }
  return records;
}

function getSubjectMarks(avg) {
  const base = [
    { name: 'English', offset: 3 },
    { name: 'Mathematics', offset: -4 },
    { name: 'Science', offset: 6 },
    { name: 'Social Studies', offset: -2 },
    { name: 'Hindi', offset: -6 },
    { name: 'Computer', offset: 8 },
  ];
  return base.map(s => ({
    name: s.name,
    marks: Math.min(100, Math.max(40, avg + s.offset)),
    max: 100,
  }));
}

function getFeesForStudent(student) {
  const history = [
    { name: 'Tuition Fee (Q1)', amount: 11250, paid: '2026-01-10', mode: 'UPI' },
    { name: 'Transport Fee (Jan–Mar)', amount: 3000, paid: '2026-01-10', mode: 'UPI' },
    { name: 'Exam Fee', amount: 2500, paid: '2026-02-05', mode: 'Card' },
  ];
  if (!student.feeDue) {
    return { pending: [], history };
  }
  const tuition = Math.round(student.feeDue * 0.7);
  const transport = Math.round(student.feeDue * 0.25);
  const other = student.feeDue - tuition - transport;
  return {
    pending: [
      { name: 'Tuition Fee (Q2)', amount: tuition, due: '2026-04-15' },
      { name: 'Transport Fee (Apr)', amount: transport, due: '2026-04-10' },
      { name: 'Other Charges', amount: Math.max(0, other), due: '2026-04-15' },
    ].filter(f => f.amount > 0),
    history,
  };
}

function findStudentByEmail(email) {
  const e = (email || '').trim().toLowerCase();
  return STUDENTS.find(s => s.email.toLowerCase() === e || s.id.toLowerCase() === e);
}

function findTeacherByEmail(email) {
  const e = (email || '').trim().toLowerCase();
  return TEACHERS.find(t => t.email.toLowerCase() === e || t.id.toLowerCase() === e);
}

function getBusInfo(busName) {
  if (!busName || busName === 'Walk') return null;
  return BUSES.find(b => b.id === busName) || null;
}

const CLASS_5A_ATTENDANCE = STUDENTS.filter(s => s.class === '5A').map((s, i) => ({
  ...s,
  todayStatus: i === 2 ? 'absent' : 'present',
}));

function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function formatINR(n) {
  return '₹ ' + Number(n).toLocaleString('en-IN');
}