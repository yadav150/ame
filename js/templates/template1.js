// js/templates/template1.js – fixed modern sidebar resume
function generateTemplate1PDF(data) {
  const p = data.personal;
  const fullName = (p.fullName || 'Your Name').trim();
  const fileName = fullName.replace(/\s+/g, '_') + '.pdf';

  // ========== 1. LEFT SIDEBAR (dark navy, fixed width) ==========
  const sidebarWidth = 180;   // pt

  // Photo frame (large, 150x150, with coloured border)
  const hasPhoto = data.photo && data.photo.length > 0;
  const photoFrame = {
    table: {
      widths: [150],
      body: [[
        hasPhoto
          ? { image: data.photo, width: 144, height: 144, margin: [3, 3, 3, 3] }
          : { text: 'PHOTO', alignment: 'center', fontSize: 16, bold: true, color: '#4f46e5', margin: [0, 55, 0, 55] }
      ]]
    },
    layout: {
      hLineWidth: () => 3,
      vLineWidth: () => 3,
      hLineColor: () => '#4f46e5',
      vLineColor: () => '#4f46e5'
    },
    margin: [0, 0, 0, 12],
    alignment: 'center'
  };

  // Name (white, centred)
  const nameBlock = { text: fullName, fontSize: 20, bold: true, color: '#ffffff', alignment: 'center', margin: [0, 5, 0, 15] };

  // Contact details (small, with label highlighted)
  const contactStack = [
    { text: 'Email', bold: true, color: '#a5b4fc', fontSize: 9, margin: [0, 0, 0, 1] },
    { text: p.email || '—', color: '#cbd5e1', fontSize: 10, margin: [0, 0, 0, 10] },
    { text: 'Phone', bold: true, color: '#a5b4fc', fontSize: 9, margin: [0, 0, 0, 1] },
    { text: p.mobile || '—', color: '#cbd5e1', fontSize: 10, margin: [0, 0, 0, 10] },
    { text: 'Address', bold: true, color: '#a5b4fc', fontSize: 9, margin: [0, 0, 0, 1] },
    { text: p.address || '—', color: '#cbd5e1', fontSize: 10, margin: [0, 0, 0, 10] }
  ];

  // Skills / Languages as bullet lists (wrap naturally)
  function tagList(title, items) {
    const listItems = items.length
      ? items.map(item => ({ text: item, fontSize: 10, color: '#e2e8f0', margin: [4, 2] }))
      : [{ text: '—', fontSize: 10, color: '#e2e8f0', margin: [4, 2] }];
    return [
      { text: title, fontSize: 12, bold: true, color: '#ffffff', margin: [0, 15, 0, 6], border: [false, false, false, true], borderColor: '#4f46e5', padding: [0, 0, 0, 4] },
      { ul: listItems, color: '#cbd5e1' }
    ];
  }

  const skillsSection = tagList('SKILLS', data.skills);
  const languagesSection = tagList('LANGUAGES', data.languages);

  // Combine sidebar content
  const sidebarContent = {
    fillColor: '#1e293b',
    margin: [15, 25, 15, 25],
    stack: [
      photoFrame,
      nameBlock,
      ...contactStack,
      ...skillsSection,
      ...languagesSection
    ],
    color: '#f1f5f9'
  };

  // ========== 2. RIGHT MAIN CONTENT ==========
  const objectiveText = 'To work in a reputed organization where I can learn new skills, improve my abilities, and contribute to organizational goals while growing professionally.';

  // Section title helper (underline)
  function mainSectionTitle(text) {
    return {
      text,
      fontSize: 12,
      bold: true,
      color: '#1e293b',
      margin: [0, 18, 0, 6],
      border: [false, false, false, true],
      borderColor: '#4f46e5',
      padding: [0, 0, 0, 4]
    };
  }

  // Personal details two‑column grid
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
          { text: l + ':', bold: true, color: '#334155', fontSize: 10 },
          { text: v, color: '#1e293b', fontSize: 10, alignment: 'right' }
        ])
      },
      layout: 'noBorders',
      margin: [0, 1, 0, 1]
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

  // Education table (responsive widths, smaller font)
  const eduBody = [
    [
      { text: 'Exam', style: 'tableHeader' },
      { text: 'University', style: 'tableHeader' },
      { text: 'Year', style: 'tableHeader' },
      { text: 'Percentage', style: 'tableHeader' },
      { text: 'Division', style: 'tableHeader' }
    ]
  ];
  data.education.forEach(e => {
    eduBody.push([
      { text: e.exam || '—', fontSize: 10 },
      { text: e.board || '—', fontSize: 10 },
      { text: e.year || '—', fontSize: 10 },
      { text: e.percent || '—', fontSize: 10 },
      { text: e.division || '—', fontSize: 10 }
    ]);
  });

  // Other Qualifications table (dynamic, same layout as education)
  const qualBody = [
    [
      { text: 'Qualification', style: 'tableHeader' },
      { text: 'Institute', style: 'tableHeader' },
      { text: 'Year', style: 'tableHeader' },
      { text: 'Grade', style: 'tableHeader' },
      { text: 'Duration', style: 'tableHeader' }
    ]
  ];
  data.qualifications.forEach(q => {
    qualBody.push([
      { text: q.name || '—', fontSize: 10 },
      { text: q.institute || '—', fontSize: 10 },
      { text: q.year || '—', fontSize: 10 },
      { text: q.grade || '—', fontSize: 10 },
      { text: q.duration || '—', fontSize: 10 }
    ]);
  });

  // Declaration
  const declarationText = data.declaration
    ? 'I hereby declare that all the information provided above is true, correct, and complete to the best of my knowledge and belief.'
    : '';

  // Footer (place, date, name)
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB');
  const place = data.place || '_______________';

  const mainContent = {
    margin: [25, 35, 25, 25],   // top margin added for objective spacing
    stack: [
      mainSectionTitle('OBJECTIVE'),
      { text: objectiveText, fontSize: 10, color: '#475569', margin: [0, 0, 0, 12] },

      mainSectionTitle('PERSONAL DETAILS'),
      personalCols,

      mainSectionTitle('EDUCATIONAL QUALIFICATION'),
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
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 5,
          paddingBottom: () => 5
        }
      },

      mainSectionTitle('OTHER QUALIFICATIONS'),
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', 'auto', 'auto', 'auto'],
          body: qualBody
        },
        layout: {
          fillColor: function (i) { return i === 0 ? '#f1f5f9' : null; },
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#cbd5e1',
          vLineColor: () => '#cbd5e1',
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 5,
          paddingBottom: () => 5
        }
      },

      mainSectionTitle('DECLARATION'),
      { text: declarationText, fontSize: 10, italics: true, color: '#64748b', margin: [0, 0, 0, 15] },

      // Place / Date / Name
      {
        columns: [
          { width: 'auto', text: 'Place: ' + place, bold: true, fontSize: 10 },
          {
            width: '*',
            alignment: 'right',
            stack: [
              { text: 'Date: ' + dateStr, bold: true, fontSize: 10 },
              { text: '(' + fullName + ')', bold: true, fontSize: 10, margin: [0, 4, 0, 0] }
            ]
          }
        ],
        margin: [0, 20, 0, 0]
      }
    ]
  };

  // ========== 3. ASSEMBLE FULL PAGE (two columns) ==========
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [0, 0, 0, 0],   // margins handled inside the two cells
    content: [
      {
        table: {
          widths: [sidebarWidth, '*'],
          body: [[
            sidebarContent,
            mainContent
          ]]
        },
        layout: 'noBorders'
      }
    ],
    styles: {
      tableHeader: { bold: true, color: '#0f172a', fontSize: 10 }
    },
    defaultStyle: { font: 'Roboto' }
  };

  pdfMake.createPdf(docDefinition).download(fileName);
}
