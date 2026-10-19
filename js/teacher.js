/* SchoolTrack Teacher Portal — loads teacher from login */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const teacherId = sessionStorage.getItem('st_teacher_id');
  const teacher = TEACHERS.find(t => t.id === teacherId) || findTeacherByEmail(sessionStorage.getItem('st_user'));

  if (!teacher) {
    window.location.href = 'index.html';
    return;
  }

  const primaryClass = teacher.classes[0];
  let classStudents = STUDENTS.filter(s => s.class === primaryClass);
  // If no students in that class in demo data, fall back to 5A
  if (!classStudents.length) {
    classStudents = STUDENTS.filter(s => s.class === '5A');
  }

  const attState = {};
  classStudents.forEach((s, i) => {
    attState[s.id] = i === 2 ? 'absent' : 'present';
  });

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

  $('#teacherName').textContent = teacher.name;
  $('#teacherMeta').textContent = `${teacher.subject} · Class Teacher ${primaryClass}`;
  $('#classTitle').textContent = `My Class — ${primaryClass}`;
  $('#rosterTitle').textContent = `Class ${primaryClass} Students`;

  function updateStats() {
    const present = Object.values(attState).filter(v => v === 'present').length;
    const absent = classStudents.length - present;
    $('#statTotal').textContent = classStudents.length;
    $('#statPresent').textContent = present;
    $('#statAbsent').textContent = absent;
  }

  function showPage(name) {
    $$('.portal-section').forEach(s => s.classList.remove('active'));
    const sec = $(`#sec-${name}`);
    if (sec) sec.classList.add('active');
    $$('.bottom-nav button').forEach(b => {
      b.classList.toggle('active', b.dataset.page === name);
    });
    window.scrollTo(0, 0);
  }

  $$('.bottom-nav button, .quick-card, [data-page]').forEach(btn => {
    if (!btn.dataset.page) return;
    btn.addEventListener('click', () => showPage(btn.dataset.page));
  });

  function renderAttendance() {
    $('#teacherAttList').innerHTML = classStudents.map(s => {
      const st = attState[s.id];
      return `
        <div class="check-row" data-id="${s.id}">
          <div class="left">
            <div class="avatar">${initials(s.name)}</div>
            <div>
              <strong style="font-size:0.9rem">${s.name}</strong>
              <div style="font-size:0.75rem;color:var(--text-muted)">Roll ${s.roll}</div>
            </div>
          </div>
          <div class="att-toggle">
            <button type="button" class="${st === 'present' ? 'on-present' : ''}" data-set="present">Present</button>
            <button type="button" class="${st === 'absent' ? 'on-absent' : ''}" data-set="absent">Absent</button>
          </div>
        </div>
      `;
    }).join('');

    $$('#teacherAttList .att-toggle button').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.closest('.check-row').dataset.id;
        attState[id] = btn.dataset.set;
        renderAttendance();
        updateStats();
      });
    });
  }

  $('#markAllPresent').addEventListener('click', () => {
    classStudents.forEach(s => { attState[s.id] = 'present'; });
    renderAttendance();
    updateStats();
    toast('All marked present');
  });

  $('#saveAttendance').addEventListener('click', () => toast(`Attendance saved for Class ${primaryClass}`));

  function renderMarksEntry() {
    $('#marksEntryList').innerHTML = classStudents.map(s => `
      <div class="check-row">
        <div class="left">
          <div class="avatar">${initials(s.name)}</div>
          <strong style="font-size:0.9rem">${s.name}</strong>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <input type="number" class="marks-input" min="0" max="100" value="${s.avgMarks}" data-id="${s.id}" />
          <span style="font-size:0.8rem;color:var(--text-muted)">/100</span>
        </div>
      </div>
    `).join('');
  }

  // Prefill subject dropdown with teacher's subject
  const subSel = $('#markSubject');
  if (subSel) {
    const opts = [...subSel.options];
    const match = opts.find(o => o.value === teacher.subject || o.text === teacher.subject);
    if (match) subSel.value = match.value;
  }

  $('#saveMarks').addEventListener('click', () => {
    const subject = $('#markSubject').value;
    const exam = $('#markExam').value;
    toast(`${subject} marks saved (${exam})`);
  });

  function renderRoster() {
    $('#classRoster').innerHTML = classStudents.map(s => `
      <div class="check-row" style="cursor:pointer" data-profile="${s.id}">
        <div class="left">
          <div class="avatar">${initials(s.name)}</div>
          <div>
            <strong style="font-size:0.9rem">${s.name}</strong>
            <div style="font-size:0.75rem;color:var(--text-muted)">Roll ${s.roll} · Att ${s.attendance}%</div>
          </div>
        </div>
        <span style="color:var(--text-muted)">→</span>
      </div>
    `).join('');

    $$('[data-profile]').forEach(row => {
      row.addEventListener('click', () => openProfile(row.dataset.profile));
    });
  }

  function openProfile(id) {
    const s = STUDENTS.find(x => x.id === id);
    if (!s) return;
    $('#studentProfileBody').innerHTML = `
      <div style="text-align:center;margin-bottom:18px">
        <div class="avatar" style="width:72px;height:72px;font-size:1.4rem;margin:0 auto 10px">${initials(s.name)}</div>
        <strong style="font-size:1.15rem;color:var(--navy)">${s.name}</strong>
        <div style="color:var(--text-muted);font-size:0.88rem">${s.id} · Class ${s.class} · Roll ${s.roll}</div>
      </div>
      <div class="att-list-item"><span>Parent</span><strong>${s.parent}</strong></div>
      <div class="att-list-item"><span>Phone</span><strong>${s.phone}</strong></div>
      <div class="att-list-item"><span>Email</span><strong style="font-size:0.8rem">${s.email}</strong></div>
      <div class="att-list-item"><span>Attendance</span><span class="tag tag-green">${s.attendance}%</span></div>
      <div class="att-list-item"><span>Avg Marks</span><span class="tag tag-blue">${s.avgMarks}%</span></div>
      <div class="att-list-item"><span>Fee Due</span><strong>${s.feeDue ? formatINR(s.feeDue) : 'Nil'}</strong></div>
      <div class="att-list-item" style="border:none"><span>Bus</span><strong>${s.bus}</strong></div>
    `;
    showPage('profile');
  }

  const icons = { meeting: '👥', exam: '📝', holiday: '🏖️', event: '🏆', fee: '💳' };
  $('#teacherNotices').innerHTML = NOTICES.map(n => `
    <li>
      <div class="notice-icon">${icons[n.type] || '📢'}</div>
      <div>
        <div class="title">${n.title}</div>
        <div class="meta">${n.date}</div>
        <p style="margin-top:4px;font-size:0.82rem;color:var(--text-muted)">${n.body}</p>
      </div>
    </li>
  `).join('');

  $('#createNotice').addEventListener('click', () => toast('Create notice — demo mode'));

  renderAttendance();
  renderMarksEntry();
  renderRoster();
  updateStats();
})();
