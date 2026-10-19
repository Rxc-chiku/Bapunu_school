/* SchoolTrack Parent Portal — loads student from login */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const studentId = sessionStorage.getItem('st_student_id');
  const student = STUDENTS.find(s => s.id === studentId) || findStudentByEmail(sessionStorage.getItem('st_user'));

  if (!student) {
    window.location.href = 'index.html';
    return;
  }

  const subjects = getSubjectMarks(student.avgMarks);
  const fees = getFeesForStudent(student);
  const bus = getBusInfo(student.bus);
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
  }

  function logout() {
    sessionStorage.clear();
    location.href = 'index.html';
  }

  $('#logoutBtn').addEventListener('click', logout);

  function showPage(name) {
    const key = name || 'home';
    $$('.portal-section').forEach(s => s.classList.remove('active'));
    const sec = $(`#sec-${key}`);
    if (sec) sec.classList.add('active');
    $$('.bottom-nav button').forEach(b => {
      b.classList.toggle('active', b.dataset.page === key);
    });
    window.scrollTo(0, 0);
  }

  $$('.bottom-nav button, .quick-card').forEach(btn => {
    btn.addEventListener('click', () => showPage(btn.dataset.page));
  });

  /* Header + profile */
  $('#greetText').textContent = `${greet} 👋`;
  $('#headerTitle').textContent = student.parent;
  $('#studentAvatar').textContent = initials(student.name);
  $('#studentName').textContent = student.name;
  $('#studentMeta').textContent = `Class ${student.class} · Roll ${String(student.roll).padStart(2, '0')} · ID ${student.id}`;

  $('#qAtt').textContent = `Present · ${student.attendance}%`;
  $('#qMarks').textContent = `Overall ${student.avgMarks}%`;
  $('#qFees').textContent = student.feeDue ? `${formatINR(student.feeDue)} Due` : 'All Paid';
  $('#qBus').textContent = bus ? `${bus.status} · ${bus.eta}` : student.bus === 'Walk' ? 'Walks to school' : 'No bus';

  /* Notices */
  const icons = { meeting: '👥', exam: '📝', holiday: '🏖️', event: '🏆', fee: '💳' };
  $('#parentNotices').innerHTML = NOTICES.slice(0, 3).map(n => `
    <li>
      <div class="notice-icon">${icons[n.type] || '📢'}</div>
      <div>
        <div class="title">${n.title}</div>
        <div class="meta">${n.date}</div>
      </div>
    </li>
  `).join('');

  /* Calendar — unique per student */
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const records = generateMonthAttendance(year, month, student.id);
  const firstDow = new Date(year, month, 1).getDay();
  const done = records.filter(r => r.status === 'present' || r.status === 'absent');
  const presentCount = done.filter(r => r.status === 'present').length;
  const monthPct = done.length ? Math.round((presentCount / done.length) * 100) : student.attendance;

  $('#calMonthLabel').textContent = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  $('#attMonthPct').textContent = `${monthPct}% this month`;
  $('#calHeads').innerHTML = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    .map(d => `<div class="cal-head">${d}</div>`).join('');

  let daysHtml = '';
  for (let i = 0; i < firstDow; i++) daysHtml += '<div class="cal-day empty"></div>';
  records.forEach(r => {
    let cls = 'cal-day';
    if (r.status === 'present') cls += ' present';
    else if (r.status === 'absent') cls += ' absent';
    else if (r.status === 'holiday') cls += ' holiday';
    if (r.day === now.getDate()) cls += ' today';
    daysHtml += `<div class="${cls}">${r.day}</div>`;
  });
  $('#calDays').innerHTML = daysHtml;

  const recent = done.slice(-8).reverse();
  $('#attRecent').innerHTML = recent.map(r => {
    const d = new Date(year, month, r.day);
    return `
      <div class="att-list-item">
        <span>${d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
        <span class="tag ${r.status === 'present' ? 'tag-green' : 'tag-red'}">${r.status === 'present' ? 'Present' : 'Absent'}</span>
      </div>
    `;
  }).join('');

  /* Exam results */
  $('#overallPct').textContent = student.avgMarks + '%';
  new Chart($('#parentExamChart'), {
    type: 'doughnut',
    data: {
      labels: ['Scored', 'Rest'],
      datasets: [{
        data: [student.avgMarks, 100 - student.avgMarks],
        backgroundColor: ['#16a34a', '#e2e8f0'],
        borderWidth: 0,
      }],
    },
    options: {
      cutout: '72%',
      plugins: { legend: { display: false } },
      maintainAspectRatio: false,
    },
  });

  $('#parentSubjects').innerHTML = subjects.map(s => `
    <div class="marks-row">
      <div class="subject">${s.name}</div>
      <div class="bar-wrap">
        <div class="progress"><div class="progress-bar ${s.marks >= 80 ? 'green' : ''}" style="width:${s.marks}%"></div></div>
      </div>
      <div class="score">${s.marks}/100</div>
    </div>
  `).join('');

  /* Fees */
  const totalDue = fees.pending.reduce((a, f) => a + f.amount, 0);
  $('#feeTotalAmount').textContent = formatINR(totalDue);
  if (!totalDue) {
    $('#payNowBtn').textContent = 'No Dues';
    $('#payNowBtn').disabled = true;
    $('#feeBreakdown').innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;padding:8px 0">All fees are paid. Thank you!</p>';
  } else {
    $('#feeBreakdown').innerHTML = fees.pending.map(f => `
      <div class="att-list-item">
        <div>
          <strong style="font-size:0.9rem">${f.name}</strong>
          <div style="font-size:0.75rem;color:var(--text-muted)">Due ${f.due}</div>
        </div>
        <strong>${formatINR(f.amount)}</strong>
      </div>
    `).join('');
  }

  $('#feeHistory').innerHTML = fees.history.map(f => `
    <div class="att-list-item">
      <div>
        <strong style="font-size:0.9rem">${f.name}</strong>
        <div style="font-size:0.75rem;color:var(--text-muted)">Paid ${f.paid} · ${f.mode}</div>
      </div>
      <span class="tag tag-green">${formatINR(f.amount)}</span>
    </div>
  `).join('');

  $$('.tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const pending = btn.dataset.tab === 'pending';
      $('#feePendingPane').style.display = pending ? 'block' : 'none';
      $('#feeHistoryPane').style.display = pending ? 'none' : 'block';
    });
  });

  $('#payNowBtn').addEventListener('click', () => {
    if (totalDue) toast('Payment gateway — demo mode');
  });

  /* Bus */
  if (bus) {
    $('#busPanel').innerHTML = `
      <div class="bus-map" style="height:260px">
        <div class="bus-route"></div>
        <div class="bus-pin">🚌</div>
      </div>
      <div style="margin-top:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div>
            <strong style="color:var(--navy);font-size:1.05rem">${bus.id}</strong>
            <div style="font-size:0.85rem;color:var(--text-muted)">${bus.route}</div>
          </div>
          <span class="tag ${bus.status === 'Delayed' ? 'tag-yellow' : 'tag-green'}">${bus.status}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.88rem">
          <div style="background:var(--bg);padding:12px;border-radius:10px">
            <div style="color:var(--text-muted);font-size:0.75rem">ETA</div>
            <strong>${bus.eta}</strong>
          </div>
          <div style="background:var(--bg);padding:12px;border-radius:10px">
            <div style="color:var(--text-muted);font-size:0.75rem">Driver</div>
            <strong>${bus.driver}</strong>
          </div>
          <div style="background:var(--bg);padding:12px;border-radius:10px;grid-column:1/-1">
            <div style="color:var(--text-muted);font-size:0.75rem">Contact</div>
            <strong>${bus.phone}</strong>
          </div>
        </div>
      </div>
    `;
  } else {
    $('#busPanel').innerHTML = `
      <div style="text-align:center;padding:32px 16px;color:var(--text-muted)">
        <div style="font-size:2.5rem;margin-bottom:10px">🚶</div>
        <strong style="color:var(--navy);display:block;margin-bottom:6px">No school bus assigned</strong>
        ${student.name} walks / uses private transport.
      </div>
    `;
  }

  /* More */
  $('#morePanel').innerHTML = `
    <div class="att-list-item"><span>Student</span><span style="color:var(--text-muted)">${student.name}</span></div>
    <div class="att-list-item"><span>Parent</span><span style="color:var(--text-muted)">${student.parent}</span></div>
    <div class="att-list-item"><span>Phone</span><span style="color:var(--text-muted)">${student.phone}</span></div>
    <div class="att-list-item"><span>Email</span><span style="color:var(--text-muted);font-size:0.8rem">${student.email}</span></div>
    <div class="att-list-item"><span>Address</span><span style="color:var(--text-muted)">${student.address}</span></div>
    <div class="att-list-item"><span>Class / Roll</span><span style="color:var(--text-muted)">${student.class} · ${student.roll}</span></div>
    <div class="att-list-item"><span>School</span><span style="color:var(--text-muted)">Green Valley High</span></div>
    <div class="att-list-item" style="border:none;padding-top:18px">
      <button class="btn btn-outline btn-block" id="signOutBtn">Sign Out</button>
    </div>
  `;
  $('#signOutBtn').addEventListener('click', logout);
})();
