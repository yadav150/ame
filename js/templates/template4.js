// js/templates/template4.js — final refined design
function generateTemplate4PDF(data) {
  const p = data.personal;
  const fullName = (p.fullName || 'Your Name').trim();
  const fileName = fullName.replace(/\s+/g, '_') + '.pdf';

  // ========== HELPER: blue bar + title section heading ==========
  function sectionHeader(text) {
    return {
      table: {
        widths: [4, '*'],
        body: [[
          { canvas: [{ type: 'rect', x: 0, y: 0, w: 4, h: 16, r: 0, color: '#4f46e5' }], margin: [0, 2, 0, 0], border: [false, false, false, false] },
          { text, bold: true, fontSize: 13, color: '#4f46e5', fillColor: '#f8fafc', margin: [6, 2, 0, 2], border: [false, false, false, false] }
        ]]
      },
      layout: 'noBorders',
      margin: [0, 10, 0, 4]
    };
  }

  // ========== Personal details (two columns) ==========
  const personalRows = [
    ['Father\'s Name', p.fatherName || '—'],
    ['Mother\'s Name', p.motherName || '—'],
    ['Date of Birth', p.dob || '—'],
    ['Gender', p.gender || '—'],
    ['Marital Status', p.maritalStatus || '—'],
    ['Category', p.category || '—'],
    ['Experience', p.experience || '—'],
    ['Nationality', '—']
  ];
  const half = Math.ceil(personalRows.length / 2);
  const leftRows = personalRows.slice(0, half);
  const rightRows = personalRows.slice(half);

  function buildPersonalTable(rows) {
    return {
      table: {
        widths: ['*', '*'],
        body: rows.map(([l, v]) => [
          { text: l + ':', bold: true, color: '#334155', fontSize: 11 },
          { text: v, color: '#1e293b', fontSize: 11, alignment: 'right' }
        ])
      },
      layout: 'noBorders',
      margin: [0, 2, 0, 2]
    };
  }

  const personalCols = {
    columns: [
      { width: '48%', stack: [ buildPersonalTable(leftRows) ] },
      { width: '4%', text: '' },
      { width: '48%', stack: [ buildPersonalTable(rightRows) ] }
    ],
    columnGap: 0
  };

  // ========== Education table ==========
  const eduBody = [
    [
      { text: 'Exam', style: 'tableHeader' },
      { text: 'Board/University', style: 'tableHeader' },
      { text: 'Year', style: 'tableHeader' },
      { text: 'Percentage/CGPA', style: 'tableHeader' },
      { text: 'Division', style: 'tableHeader' }
    ]
  ];
  data.education.forEach(e => {
    eduBody.push([
      e.exam || '—',
      e.board || '—',
      e.year || '—',
      e.percent || '—',
      e.division || '—'
    ]);
  });

  // ========== Skills & Languages as tag chips ==========
  function buildTagRow(tags, color, bgColor) {
    if (!tags.length) return { text: '—', fontSize: 11 };
    const cells = tags.map(tag => ({
      text: tag,
      fontSize: 10,
      bold: false,
      color: color,
      fillColor: bgColor,
      alignment: 'center',
      margin: [0, 0, 4, 0]
    }));
    return {
      table: {
        widths: Array(tags.length).fill('auto'),
        body: [ cells ]
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingLeft: () => 6,
        paddingRight: () => 6,
        paddingTop: () => 3,
        paddingBottom: () => 3,
        fillColor: () => null
      },
      margin: [0, 4, 0, 8]
    };
  }

  const skillsTags = data.skills.length ? data.skills : [];
  const langTags = data.languages.length ? data.languages : [];

  // ========== Other qualifications ==========
  const qualItems = data.qualifications.map(q => ({
    text: `${q.name || '—'} ${q.institute ? '(' + q.institute + ')' : ''}  |  ${q.year || ''}  ${q.grade ? '| ' + q.grade : ''}  ${q.duration ? '(' + q.duration + ')' : ''}`,
    margin: [0, 2]
  }));

  // ========== Declaration ==========
  const declarationText = data.declaration
    ? 'I hereby declare that all the information provided above is true, correct, and complete to the best of my knowledge and belief. I understand that if any information is found false, I will be responsible for consequences including rejection or termination.'
    : '';

  // ========== Header with photo ==========
  const hasPhoto = data.photo && data.photo.length > 0;
  const photoCell = hasPhoto ? {
    image: data.photo,
    width: 80,
    height: 80,
    border: [2, 2, 2, 2],
    borderColor: '#4f46e5',
    margin: [0, 0, 15, 0]
  } : {
    canvas: [
      { type: 'rect', x: 0, y: 0, w: 80, h: 80, r: 8, color: '#e0e7ff' },
      { type: 'line', x1: 0, y1: 0, x2: 80, y2: 0, lineWidth: 2, lineColor: '#4f46e5' },
      { type: 'line', x1: 80, y1: 0, x2: 80, y2: 80, lineWidth: 2, lineColor: '#4f46e5' },
      { type: 'line', x1: 80, y1: 80, x2: 0, y2: 80, lineWidth: 2, lineColor: '#4f46e5' },
      { type: 'line', x1: 0, y1: 80, x2: 0, y2: 0, lineWidth: 2, lineColor: '#4f46e5' }
    ],
    width: 80,
    height: 80,
    margin: [0, 0, 15, 0]
  };

  const headerTable = {
    table: {
      widths: ['auto', '*'],
      body: [[
        photoCell,
        {
          stack: [
            { text: fullName, fontSize: 26, bold: true, color: '#1e293b', margin: [0, 0, 0, 4] },
            { text: `Email: ${p.email || ''}  |  Phone: ${p.mobile || ''}`, fontSize: 11, color: '#475569' },
            { text: `Address: ${p.address || ''}`, fontSize: 11, color: '#475569', margin: [0, 2, 0, 0] }
          ],
          margin: [0, 8, 0, 0]
        }
      ]]
    },
    layout: 'noBorders',
    margin: [0, 0, 0, 10]
  };

  // ========== Date, Place, Name footer ==========
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB');
  const place = data.place || '_______________';

  // ========== Final document ==========
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [56.7, 51, 56.7, 51], // 20mm left/right, 18mm top/bottom
    content: [
      headerTable,

      // objective
      sectionHeader('OBJECTIVE'),
      { text: 'To work in a reputed organization where I can learn new skills, improve my abilities, and contribute to organizational goals while growing professionally.', fontSize: 11, color: '#334155', margin: [4, 0, 0, 8] },

      // personal details
      sectionHeader('PERSONAL DETAILS'),
      personalCols,

      // education
      sectionHeader('EDUCATIONAL QUALIFICATION'),
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', 'auto', 'auto', 'auto'],
          body: eduBody
        },
        layout: {
          fillColor: function (i) { return i === 0 ? '#f1f5f9' : null; },
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#cbd5e1',
          vLineColor: () => '#cbd5e1',
          paddingLeft: () => 8,
          paddingRight: () => 8,
          paddingTop: () => 6,
          paddingBottom: () => 6
        }
      },

      // skills
      sectionHeader('SKILLS'),
      buildTagRow(skillsTags, '#4338ca', '#eef2ff'),

      // languages
      sectionHeader('LANGUAGES KNOWN'),
      buildTagRow(langTags, '#4338ca', '#eef2ff'),

      // other qualifications
      sectionHeader('OTHER QUALIFICATIONS'),
      { ul: qualItems.length ? qualItems : [{ text: '—', fontSize: 11 }] },

      // declaration
      sectionHeader('DECLARATION'),
      { text: declarationText, fontSize: 11, italics: true, color: '#475569', margin: [4, 0, 0, 12] },

      // footer
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
      tableHeader: { bold: true, color: '#1e293b' }
    },
    defaultStyle: { font: 'Roboto' }
  };

  pdfMake.createPdf(docDefinition).download(fileName);
}
