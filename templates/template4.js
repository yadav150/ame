// js/templates/template4.js
// Uses pdfmake to generate a text-based, A4 resume PDF

function generateTemplate4PDF(data) {
  const p = data.personal;
  const fullName = (p.fullName || 'Your Name').trim();
  const fileName = fullName.replace(/\s+/g, '_') + '.pdf';

  // Objective is predefined
  const objectiveText = 'To work in a reputed organization where I can learn new skills, improve my abilities, and contribute to organizational goals while growing professionally.';

  // Personal details table rows
  const personalRows = [
    ['Father\'s Name', p.fatherName || '—'],
    ['Mother\'s Name', p.motherName || '—'],
    ['Date of Birth', p.dob || '—'],
    ['Gender', p.gender || '—'],
    ['Marital Status', p.maritalStatus || '—'],
    ['Category', p.category || '—'],
    ['Experience', p.experience || '—'],
    ['Nationality', '—']   // can be extended later
  ];

  // Education table
  const eduBody = [];
  eduBody.push([
    { text: 'Exam', style: 'tableHeader' },
    { text: 'Board/University', style: 'tableHeader' },
    { text: 'Year', style: 'tableHeader' },
    { text: 'Percentage/CGPA', style: 'tableHeader' },
    { text: 'Division', style: 'tableHeader' }
  ]);
  data.education.forEach(e => {
    eduBody.push([
      e.exam || '—',
      e.board || '—',
      e.year || '—',
      e.percent || '—',
      e.division || '—'
    ]);
  });

  // Skills & Languages as tags
  const skillsTags = data.skills.length ? data.skills.join(', ') : '—';
  const langTags = data.languages.length ? data.languages.join(', ') : '—';

  // Other qualifications
  const qualItems = data.qualifications.map(q => ({
    text: `${q.name || '—'} ${q.institute ? '(' + q.institute + ')' : ''}  |  ${q.year || ''}  ${q.grade ? '| ' + q.grade : ''}  ${q.duration ? '(' + q.duration + ')' : ''}`,
    margin: [0, 2]
  }));

  // Declaration
  const declarationText = data.declaration
    ? 'I hereby declare that all the information provided above is true, correct, and complete to the best of my knowledge and belief. I understand that if any information is found false, I will be responsible for consequences including rejection or termination.'
    : '';

  // Date (auto) and Place
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB'); // DD/MM/YYYY
  const place = data.place || '_______________';

  // Photo handling
  let photoNode = null;
  if (data.photo && data.photo.length > 0) {
    // Photo as background image in header? Better to put as image in header column
    photoNode = {
      image: data.photo,
      width: 80,
      height: 80,
      absolutePosition: { x: 40, y: 40 }
    };
  }

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40],
    background: photoNode ? function() { return photoNode; } : undefined,
    content: [
      // HEADER (with photo placeholder if no photo)
      {
        margin: [photoNode ? 90 : 0, 0, 0, 10],
        stack: [
          { text: fullName, fontSize: 26, bold: true, color: '#1e293b', margin: [0, 0, 0, 4] },
          { text: `Email: ${p.email || ''}  |  Phone: ${p.mobile || ''}`, fontSize: 11, color: '#475569' },
          { text: `Address: ${p.address || ''}`, fontSize: 11, color: '#475569', margin: [0, 2, 0, 0] }
        ]
      },
      // OBJECTIVE
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: '#cbd5e1', dash: { length: 5 } }], margin: [0, 12, 0, 8] },
      { text: 'OBJECTIVE', style: 'sectionHeader' },
      { text: objectiveText, fontSize: 11, color: '#334155', margin: [4, 2, 0, 8] },

      // SEPARATOR (dashed line)
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: '#cbd5e1', dash: { length: 5 } }], margin: [0, 8, 0, 8] },

      // PERSONAL DETAILS
      { text: 'PERSONAL DETAILS', style: 'sectionHeader' },
      {
        columns: personalRows.map(([label, value]) => ({
          width: 'auto',
          text: [
            { text: label + ': ', bold: true, color: '#334155' },
            { text: value, color: '#1e293b' }
          ],
          fontSize: 11,
          margin: [0, 2]
        })),
        columnGap: 20
      },

      // SEPARATOR
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: '#cbd5e1', dash: { length: 5 } }], margin: [0, 10, 0, 8] },

      // EDUCATIONAL QUALIFICATION
      { text: 'EDUCATIONAL QUALIFICATION', style: 'sectionHeader' },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', 'auto', 'auto', 'auto'],
          body: eduBody
        },
        layout: {
          fillColor: function (i) { return i === 0 ? '#f1f5f9' : null; },
          hLineWidth: function () { return 0.5; },
          vLineWidth: function () { return 0.5; },
          hLineColor: function () { return '#cbd5e1'; },
          vLineColor: function () { return '#cbd5e1'; },
          paddingLeft: function () { return 8; },
          paddingRight: function () { return 8; },
          paddingTop: function () { return 6; },
          paddingBottom: function () { return 6; }
        }
      },

      // SEPARATOR
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: '#cbd5e1', dash: { length: 5 } }], margin: [0, 10, 0, 8] },

      // SKILLS
      { text: 'SKILLS', style: 'sectionHeader' },
      { text: skillsTags, fontSize: 11, color: '#1e293b', margin: [4, 2, 0, 6] },

      // LANGUAGES KNOWN
      { text: 'LANGUAGES KNOWN', style: 'sectionHeader' },
      { text: langTags, fontSize: 11, color: '#1e293b', margin: [4, 2, 0, 8] },

      // SEPARATOR
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: '#cbd5e1', dash: { length: 5 } }], margin: [0, 8, 0, 8] },

      // OTHER QUALIFICATIONS
      { text: 'OTHER QUALIFICATIONS', style: 'sectionHeader' },
      { ul: qualItems.length ? qualItems : [{ text: '—', fontSize: 11 }] },

      // SEPARATOR
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: '#cbd5e1', dash: { length: 5 } }], margin: [0, 10, 0, 8] },

      // DECLARATION
      { text: 'DECLARATION', style: 'sectionHeader' },
      { text: declarationText, fontSize: 11, italics: true, color: '#475569', margin: [4, 2, 0, 12] },

      // FOOTER: Place | Date | Name
      {
        columns: [
          { width: 'auto', text: 'Place: ' + place, bold: true, fontSize: 11 },
          {
            width: '*',
            alignment: 'right',
            stack: [
              { text: 'Date: ' + dateStr, bold: true, fontSize: 11 },
              { text: '(' + fullName + ')', bold: true, fontSize: 11, margin: [0, 4, 0, 0] }
            ]
          }
        ],
        margin: [0, 20, 0, 0]
      }
    ],
    styles: {
      sectionHeader: {
        fontSize: 13,
        bold: true,
        color: '#4f46e5',
        margin: [0, 0, 0, 4]
      },
      tableHeader: {
        bold: true,
        color: '#1e293b'
      }
    },
    defaultStyle: {
      font: 'Roboto'
    }
  };

  // Generate and auto-download
  pdfMake.createPdf(docDefinition).download(fileName);
}
