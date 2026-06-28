// js/templates/template3.js – Classic Professional (stable, like template4)
function generateTemplate3PDF(data) {
  const p = data.personal;
  const fullName = (p.fullName || 'Your Name').trim();
  const fileName = fullName.replace(/\s+/g, '_') + '.pdf';

  // ========== HELPERS ==========
  function sectionHeader(text) {
    return {
      table: {
        widths: [4, '*'],
        body: [[
          { canvas: [{ type: 'rect', x: 0, y: 0, w: 4, h: 14, r: 0, color: '#4f46e5' }], margin: [0, 2, 0, 0], border: [false, false, false, false] },
          { text, bold: true, fontSize: 13, color: '#4f46e5', fillColor: '#f8fafc', margin: [6, 2, 0, 2], border: [false, false, false, false] }
        ]]
      },
      layout: 'noBorders',
      margin: [0, 10, 0, 4]
    };
  }

  // Personal details (two columns)
  const personalRows = [
    ['Father', p.fatherName || '—'],
    ['Mother', p.motherName || '—'],
    ['Date of Birth', p.dob || '—'],
    ['Gender', p.gender || '—'],
    ['Marital', p.maritalStatus || '—'],
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

  // Education / Qualifications as timeline-style table
  function buildTimelineTable(entries) {
    if (!entries.length) return { text: '—', fontSize: 11, margin: [0, 4, 0, 8] };
    const body = [];
    entries.forEach(entry => {
      body.push([
        { canvas: [{ type: 'ellipse', x: 2, y: 5, r1: 3, r2: 3, color: '#4f46e5' }], width: 10, border: [false, false, false, false], margin: [0, 4, 0, 0] },
        {
          stack: [
            { text: entry.header, bold: true, fontSize: 12, color: '#1e293b', margin: [0, 0, 2, 0] },
            { text: entry.sub1, fontSize: 11, color: '#64748b', margin: [0, 0, 1, 0] },
            ...(entry.sub2 ? [{ text: entry.sub2, fontSize: 11, color: '#64748b', margin: [0, 0, 0, 0] }] : [])
          ],
          margin: [4, 0, 0, 8]
        }
      ]);
    });
    return {
      table: {
        widths: [10, '*'],
        body: body
      },
      layout: 'noBorders',
      margin: [0, 4, 0, 8]
    };
  }

  const educationEntries = data.education.map(e => ({
    header: e.exam || '—',
    sub1: `${e.board || '—'}, ${e.year || '—'}`,
    sub2: `${e.percent || '—'} — ${e.division || '—'}`
  }));

  const qualEntries = data.qualifications.map(q => ({
    header: q.name || '—',
    sub1: `${q.institute || '—'}, ${q.year || '—'}`,
    sub2: `${q.grade || '—'} — ${q.duration || '—'}`
  }));

  // Skills / Languages chips
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

  // Other qualifications (list style)
  const qualItems = data.qualifications.map(q => ({
    text: `${q.name || '—'} ${q.institute ? '(' + q.institute + ')' : ''}  |  ${q.year || ''}  ${q.grade ? '| ' + q.grade : ''}  ${q.duration ? '(' + q.duration + ')' : ''}`,
    margin: [0, 2]
  }));

  // Declaration
  const declarationText = data.declaration
    ? 'I hereby declare that the information provided above is true and correct to the best of my knowledge and belief.'
    : '';

  // ========== HEADER WITH LARGE CIRCULAR PHOTO ==========
  const hasPhoto = data.photo && data.photo.length > 0;
  const circleDiameter = 160;   // slightly smaller to fit nicely
  const photoCell = {
    // Image (placed first)
    ...(hasPhoto ? { image: data.photo, width: circleDiameter, height: circleDiameter } : {}),
    // White circle overlay to clip corners (drawn after image)
    canvas: [
      { type: 'ellipse', x: circleDiameter/2, y: circleDiameter/2, r1: circleDiameter/2, r2: circleDiameter/2, color: '#ffffff', lineWidth: 2, lineColor: '#4f46e5' }
    ],
    width: circleDiameter,
    height: circleDiameter,
    margin: [0, 0, 15, 0]
  };
  // If no photo, just show the white circle as placeholder
  if (!hasPhoto) {
    photoCell.canvas = [
      { type: 'ellipse', x: circleDiameter/2, y: circleDiameter/2, r1: circleDiameter/2, r2: circleDiameter/2, color: '#f1f5f9', lineWidth: 2, lineColor: '#4f46e5' }
    ];
    photoCell.text = 'PHOTO';
    photoCell.fontSize = 18;
    photoCell.bold = true;
    photoCell.color = '#4f46e5';
    photoCell.alignment = 'center';
  }

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
    margin: [0, 0, 0, 15]
  };

  // Underline after header
  const headerUnderline = {
    canvas: [
      { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: '#1e293b', dash: { length: 0 } }
    ],
    margin: [0, 0, 0, 20]
  };

  // ========== FOOTER ==========
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB');
  const place = data.place || '_______________';

  // ========== FINAL DOCUMENT ==========
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [56.7, 51, 56.7, 51],
    content: [
      headerTable,
      headerUnderline,

      // Objective
      sectionHeader('OBJECTIVE'),
      { text: 'To work in a reputed organization where I can learn new skills, improve my abilities, and contribute to organizational goals while growing professionally.', fontSize: 11, color: '#334155', margin: [4, 0, 0, 8] },

      // Personal Details
      sectionHeader('PERSONAL DETAILS'),
      personalCols,

      // Education (timeline style)
      sectionHeader('EDUCATION'),
      buildTimelineTable(educationEntries),

      // Skills
      sectionHeader('SKILLS'),
      buildTagRow(skillsTags, '#4338ca', '#eef2ff'),

      // Languages
      sectionHeader('LANGUAGES KNOWN'),
      buildTagRow(langTags, '#4338ca', '#eef2ff'),

      // Other Qualifications (timeline style)
      sectionHeader('OTHER QUALIFICATIONS'),
      buildTimelineTable(qualEntries),

      // Declaration
      sectionHeader('DECLARATION'),
      { text: declarationText, fontSize: 11, italics: true, color: '#475569', margin: [4, 0, 0, 12] },

      // Footer
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
