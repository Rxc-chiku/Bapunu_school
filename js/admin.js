/* SchoolTrack Admin Dashboard */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
  }

  function grade(marks) {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    return 'D';
  }

  function noticeIcon(type) {
    return { meeting: '👥', exam: '📝', holiday: '🏖️', event: '🏆', fee: '💳' }[type] || '📢';
  }

  /* Navigation */
  function showView(name) {
    $$('.view').forEach(v => v.classList.remove('active'));
    $$('.nav-item').forEach(n => n.classList.remove('active'));
    const view = $(`#view-${name}`);
    const nav = $(`.nav-item[data-view="${name}"]`);
    if (view) view.classList.add('active');
    if (nav) nav.classList.add('active');
    $('#appShell').classList.remove('sidebar-open');
    $('#overlay').classList.remove('show');
    window.scrollTo(0, 0);
  }

  $$('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => showView(btn.dataset.view));
  });

  $('#menuToggle').addEventListener('click', () => {
    $('#appShell').classList.toggle('sidebar-open');
    $('#overlay').classList.toggle('show');
  });
  $('#overlay').addEventListener('click', () => {
    $('#appShell').classList.remove('sidebar-open');
    $('#overlay').classList.remove('show');
  });
  $('#logoutBtn').addEventListener('click', () => {
    sessionStorage.clear();
    location.href = 'index.html';
  });

  /* Dashboard lists */
  function renderDashLists() {
    $('#dashNotices').innerHTML = NOTICES.slice(0, 4).map(n => `
      <li>
        <div class="notice-icon">${noticeIcon(n.type)}</div>
        <div>
          <div class="title">${n.title}</div>
          <div class="meta">${n.date}</div>
        </div>
      </li>
    `).join('');

    $('#dashActivities').innerHTML = ACTIVITIES.map(a => `
      <li>
        <div class="activity-dot"></div>
        <div>
          <div class="text">${a.text}</div>
          <div class="meta">${a.time}</div>
        </div>
      </li>
    `).join('');
  }

  /* Charts */
  let charts = {};

  function makeCharts() {
    const donutOpts = {
      cutout: '72%',
      plugins: { legend: { display: false } },
      maintainAspectRatio: false,
    };

    charts.att = new Chart($('#attChart'), {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent', 'Late'],
        datasets: [{
          data: [ATTENDANCE_OVERVIEW.present, ATTENDANCE_OVERVIEW.absent, ATTENDANCE_OVERVIEW.late],
          backgroundColor: ['#16a34a', '#dc2626', '#d97706'],
          borderWidth: 0,
        }],
      },
      options: donutOpts,
    });

    $('#attLegend').innerHTML = `
      <span class="legend-item"><span class="legend-dot" style="background:#16a34a"></span>Present ${ATTENDANCE_OVERVIEW.present}</span>
      <span class="legend-item"><span class="legend-dot" style="background:#dc2626"></span>Absent ${ATTENDANCE_OVERVIEW.absent}</span>
      <span class="legend-item"><span class="legend-dot" style="background:#d97706"></span>Late ${ATTENDANCE_OVERVIEW.late}</span>
    `;

    charts.perf = new Chart($('#perfChart'), {
      type: 'bar',
      data: {
        labels: CLASS_PERFORMANCE.labels,
        datasets: [
          {
            label: 'Average Marks',
            data: CLASS_PERFORMANCE.avgMarks,
            backgroundColor: '#1a56db',
            borderRadius: 6,
            barPercentage: 0.7,
          },
          {
            label: 'Pass Percentage',
            data: CLASS_PERFORMANCE.passPct,
            backgroundColor: '#16a34a',
            borderRadius: 6,
            barPercentage: 0.7,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: '#f1f5f9' } },
          x: { grid: { display: false } },
        },
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
        },
      },
    });

    charts.fee = new Chart($('#feeChart'), {
      type: 'doughnut',
      data: {
        labels: ['Collected', 'Pending'],
        datasets: [{
          data: [FEE_COLLECTION.collected, FEE_COLLECTION.pending],
          backgroundColor: ['#1a56db', '#e2e8f0'],
          borderWidth: 0,
        }],
      },
      options: donutOpts,
    });

    charts.examDonut = new Chart($('#examDonut'), {
      type: 'doughnut',
      data: {
        labels: ['Scored', 'Remaining'],
        datasets: [{
          data: [EXAM_RESULTS.overall, 100 - EXAM_RESULTS.overall],
          backgroundColor: ['#16a34a', '#e2e8f0'],
          borderWidth: 0,
        }],
      },
      options: donutOpts,
    });

    charts.examBar = new Chart($('#examBar'), {
      type: 'bar',
      data: {
        labels: EXAM_RESULTS.subjects.map(s => s.name),
        datasets: [{
          label: 'Marks',
          data: EXAM_RESULTS.subjects.map(s => s.marks),
          backgroundColor: '#1a56db',
          borderRadius: 6,
        }],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: '#f1f5f9' } },
          x: { grid: { display: false } },
        },
        plugins: { legend: { display: false } },
      },
    });
  }

  /* Students */
  function renderStudents(list) {
    $('#studentsTable').innerHTML = list.map(s => `
      <tr>
        <td>
          <div class="student-cell">
            <div class="avatar">${initials(s.name)}</div>
            <div>
              <strong>${s.name}</strong>
              <div style="font-size:0.75rem;color:var(--text-muted)">Roll ${s.roll}</div>
            </div>
          </div>
        </td>
        <td>${s.id}</td>
        <td><span class="tag tag-blue">${s.class}</span></td>
        <td>${s.parent}</td>
        <td>${s.attendance}%</td>
        <td>${s.avgMarks}%</td>
        <td>${s.feeDue ? `<span class="tag tag-red">${formatINR(s.feeDue)}</span>` : '<span class="tag tag-green">Paid</span>'}</td>
        <td><button class="btn btn-sm btn-outline" data-student="${s.id}">View</button></td>
      </tr>
    `).join('');

    $('#studentCount').textContent = `${list.length} students`;

    $$('#studentsTable [data-student]').forEach(btn => {
      btn.addEventListener('click', () => openStudent(btn.dataset.student));
    });
  }

  function filterStudents() {
    const q = $('#studentSearch').value.toLowerCase();
    const cls = $('#filterClass').value;
    let list = STUDENTS.filter(s => {
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
      const matchC = !cls || s.class === cls;
      return matchQ && matchC;
    });
    renderStudents(list);
  }

  function openStudent(id) {
    const s = STUDENTS.find(x => x.id === id);
    if (!s) return;
    $('#modalTitle').textContent = s.name;
    $('#modalBody').innerHTML = `
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:18px">
        <div class="avatar" style="width:56px;height:56px;font-size:1.1rem">${initials(s.name)}</div>
        <div>
          <strong>${s.id}</strong> · Class ${s.class} · Roll ${s.roll}<br/>
          <span style="color:var(--text-muted);font-size:0.85rem">${s.email}</span>
        </div>
      </div>
      <div class="grid-2" style="gap:10px;font-size:0.88rem">
        <div><span style="color:var(--text-muted)">Parent</span><br/><strong>${s.parent}</strong></div>
        <div><span style="color:var(--text-muted)">Phone</span><br/><strong>${s.phone}</strong></div>
        <div><span style="color:var(--text-muted)">DOB</span><br/><strong>${s.dob}</strong></div>
        <div><span style="color:var(--text-muted)">Bus</span><br/><strong>${s.bus}</strong></div>
        <div><span style="color:var(--text-muted)">Attendance</span><br/><strong>${s.attendance}%</strong></div>
        <div><span style="color:var(--text-muted)">Avg Marks</span><br/><strong>${s.avgMarks}% (${grade(s.avgMarks)})</strong></div>
        <div style="grid-column:1/-1"><span style="color:var(--text-muted)">Address</span><br/><strong>${s.address}</strong></div>
        <div style="grid-column:1/-1"><span style="color:var(--text-muted)">Fee Due</span><br/><strong>${s.feeDue ? formatINR(s.feeDue) : 'No dues'}</strong></div>
      </div>
    `;
    $('#studentModal').classList.add('show');
  }

  $('#closeModal').addEventListener('click', () => $('#studentModal').classList.remove('show'));
  $('#studentModal').addEventListener('click', (e) => {
    if (e.target === $('#studentModal')) $('#studentModal').classList.remove('show');
  });

  /* Teachers */
  function renderTeachers() {
    $('#teachersTable').innerHTML = TEACHERS.map(t => `
      <tr>
        <td>
          <div class="student-cell">
            <div class="avatar">${initials(t.name)}</div>
            <strong>${t.name}</strong>
          </div>
        </td>
        <td>${t.subject}</td>
        <td>${t.classes.map(c => `<span class="tag tag-blue" style="margin-right:4px">${c}</span>`).join('')}</td>
        <td>${t.phone}</td>
        <td>${t.email}</td>
        <td>${t.experience}</td>
      </tr>
    `).join('');
  }

  /* Attendance */
  function renderAttendance() {
    const cls = $('#attClassFilter').value;
    const list = STUDENTS.filter(s => s.class === cls);
    $('#attDateLabel').textContent = new Date().toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    $('#attendanceTable').innerHTML = list.map((s, i) => {
      const status = (cls === '5A' && CLASS_5A_ATTENDANCE[i])
        ? CLASS_5A_ATTENDANCE[i].todayStatus
        : (i % 7 === 3 ? 'absent' : 'present');
      return `
        <tr data-id="${s.id}">
          <td>${s.roll}</td>
          <td>
            <div class="student-cell">
              <div class="avatar">${initials(s.name)}</div>
              ${s.name}
            </div>
          </td>
          <td><span class="tag ${status === 'present' ? 'tag-green' : 'tag-red'} status-tag">${status === 'present' ? 'Present' : 'Absent'}</span></td>
          <td>
            <div class="att-toggle">
              <button type="button" class="${status === 'present' ? 'on-present' : ''}" data-set="present">P</button>
              <button type="button" class="${status === 'absent' ? 'on-absent' : ''}" data-set="absent">A</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    $$('#attendanceTable .att-toggle button').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        const set = btn.dataset.set;
        row.querySelectorAll('.att-toggle button').forEach(b => b.className = '');
        btn.className = set === 'present' ? 'on-present' : 'on-absent';
        const tag = row.querySelector('.status-tag');
        tag.textContent = set === 'present' ? 'Present' : 'Absent';
        tag.className = `tag ${set === 'present' ? 'tag-green' : 'tag-red'} status-tag`;
        toast(`Marked ${set}`);
      });
    });
  }

  /* Exams */
  function renderExams() {
    $('#subjectMarks').innerHTML = EXAM_RESULTS.subjects.map(s => `
      <div class="marks-row">
        <div class="subject">${s.name}</div>
        <div class="bar-wrap">
          <div class="progress"><div class="progress-bar ${s.marks >= 80 ? 'green' : ''}" style="width:${s.marks}%"></div></div>
        </div>
        <div class="score">${s.marks}/${s.max}</div>
      </div>
    `).join('');

    $('#examTable').innerHTML = STUDENTS.map(s => `
      <tr>
        <td>
          <div class="student-cell">
            <div class="avatar">${initials(s.name)}</div>
            ${s.name}
          </div>
        </td>
        <td>${s.class}</td>
        <td>${s.avgMarks}%</td>
        <td><span class="tag tag-blue">${grade(s.avgMarks)}</span></td>
        <td style="min-width:140px">
          <div class="progress"><div class="progress-bar" style="width:${s.avgMarks}%"></div></div>
        </td>
      </tr>
    `).join('');
  }

  /* Fees */
  function renderFees() {
    $('#feeStructureTable').innerHTML = FEE_STRUCTURE.map(f => `
      <tr>
        <td>${f.name}</td>
        <td><strong>${formatINR(f.amount)}</strong></td>
        <td>${f.period}</td>
      </tr>
    `).join('') + `
      <tr>
        <td><strong>Total</strong></td>
        <td><strong>${formatINR(FEE_STRUCTURE.reduce((a, f) => a + f.amount, 0))}</strong></td>
        <td></td>
      </tr>
    `;

    const pending = STUDENTS.filter(s => s.feeDue > 0).sort((a, b) => b.feeDue - a.feeDue);
    $('#pendingFeesTable').innerHTML = pending.map(s => `
      <tr>
        <td>${s.name}</td>
        <td>${s.class}</td>
        <td>${formatINR(s.feeDue)}</td>
        <td><span class="tag tag-red">Pending</span></td>
      </tr>
    `).join('');
  }

  /* Transport */
  function renderBuses() {
    $('#busesTable').innerHTML = BUSES.map(b => {
      const tag = b.status === 'Delayed' ? 'tag-yellow' : b.status === 'Arriving' ? 'tag-blue' : 'tag-green';
      return `
        <tr>
          <td><strong>${b.id}</strong></td>
          <td>${b.driver}</td>
          <td>${b.route}</td>
          <td>${b.students}</td>
          <td>${b.eta}</td>
          <td><span class="tag ${tag}">${b.status}</span></td>
          <td>${b.phone}</td>
        </tr>
      `;
    }).join('');
  }

  /* Notices */
  function renderNotices() {
    $('#noticesFull').innerHTML = NOTICES.map(n => `
      <li style="padding:16px 0">
        <div class="notice-icon">${noticeIcon(n.type)}</div>
        <div>
          <div class="title">${n.title}</div>
          <div class="meta">${n.date}</div>
          <p style="margin-top:6px;font-size:0.88rem;color:var(--text-muted)">${n.body}</p>
        </div>
      </li>
    `).join('');
  }

  /* Reports */
  function renderReports() {
    $('#reportsTable').innerHTML = CLASS_PERFORMANCE.labels.map((label, i) => `
      <tr>
        <td>${label}</td>
        <td>${CLASS_PERFORMANCE.avgMarks[i]}%</td>
        <td>${CLASS_PERFORMANCE.passPct[i]}%</td>
        <td><span class="tag ${CLASS_PERFORMANCE.passPct[i] >= 90 ? 'tag-green' : 'tag-yellow'}">${CLASS_PERFORMANCE.passPct[i] >= 90 ? 'Good' : 'Monitor'}</span></td>
      </tr>
    `).join('');
  }

  /* Init class filters */
  const classes = [...new Set(STUDENTS.map(s => s.class))].sort();
  $('#filterClass').innerHTML += classes.map(c => `<option value="${c}">${c}</option>`).join('');

  $('#studentSearch').addEventListener('input', filterStudents);
  $('#filterClass').addEventListener('change', filterStudents);
  $('#attClassFilter').addEventListener('change', renderAttendance);
  $('#globalSearch').addEventListener('input', (e) => {
    showView('students');
    $('#studentSearch').value = e.target.value;
    filterStudents();
  });

  $('#addStudentBtn').addEventListener('click', () => toast('Add Student form — demo mode'));
  $('#addNoticeBtn').addEventListener('click', () => toast('Notice composer — demo mode'));
  $('#saveSettingsBtn').addEventListener('click', () => toast('Settings saved'));

  /* Boot */
  renderDashLists();
  makeCharts();
  renderStudents(STUDENTS);
  renderTeachers();
  renderAttendance();
  renderExams();
  renderFees();
  renderBuses();
  renderNotices();
  renderReports();
})();
