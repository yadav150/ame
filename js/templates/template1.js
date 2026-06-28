// js/templates/template1.js – modern sidebar resume (large photo, dark left bar)
function generateTemplate1PDF(data) {
  const p = data.personal;
  const fullName = (p.fullName || 'Your Name').trim();
  const fileName = fullName.replace(/\s+/g, '_') + '.pdf';

  /* ========= SIDEBAR (left column) ========= */
  const hasPhoto = data.photo && data.photo.length > 0;

  // Photo frame (white cell with blue border)
  const photoCell = {
    table: {
      widths: [120],
      body: [[
        hasPhoto
          ? { image: data.photo, width: 116, height: 116, margin: [2,2,2,2] }
          : { text: 'PHOTO', alignment: 'center', fontSize: 18, bold: true, color: '#4f46e5', margin: [0,40,0,40] }
      ]]
    },
    layout: {
      hLineWidth: () => 3,
      vLineWidth: () => 3,
      hLineColor: () => '#4f46e5',
      vLineColor: () => '#4f46e5'
    },
    margin: [0, 0, 0, 15],
    alignment: 'center'
  };

  // Name in sidebar
  const nameBlock = { text: fullName, fontSize: 22, bold: true, color: '#ffffff', alignment: 'center', margin: [0,5,0,15] };

  // Contact items
  const contactItems = [
    { stack: [ { text: 'Email', bold: true, color: '#a5b4fc', fontSize: 10 }, { text: p.email || '—', color: '#cbd5e1', fontSize: 10 } ], margin: [0,0,0,10] },
    { stack: [ { text: 'Phone', bold: true, color: '#a5b4fc', fontSize: 10 }, { text: p.mobile || '—', color: '#cbd5e1', fontSize: 10 } ], margin: [0,0,0,10] },
    { stack: [ { text: 'Address', bold: true, color: '#a5b4fc', fontSize: 10 }, { text: p.address || '—', color: '#cbd5e1', fontSize: 10 } ], margin: [0,0,0,10] }
  ];

  // Skills chips (dark background tags)
  function sidebarTagRow(tags) {
    if (!tags.length) return { text: '—', color: '#cbd5e1', fontSize: 10 };
    const cells = tags.map(tag => ({
      text: tag,
      fontSize: 9,
      color: '#e2e8f0',
      fillColor: '#334155',
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
        paddingBottom: () => 3
      },
      margin: [0, 4, 0, 8]
    };
  }

  // Sidebar section titles
  function sidebarSectionTitle(text) {
    return { text, fontSize: 13, bold: true, color: '#ffffff', margin: [0, 15, 0, 5], border: [false, false, false, true], borderColor: '#4f46e5', padding: [0,0,0,4] };
  }

  const sidebarContent = {
    fillColor: '#1e293b',
    margin: [15, 25, 15, 25],
    stack: [
      photoCell,
      nameBlock,
      ...contactItems,
      sidebarSectionTitle('SKILLS'),
      sidebarTagRow(data.skills.length ? data.skills : []),
      sidebarSectionTitle('LANGUAGES'),
      sidebarTagRow(data.languages.length ? data.languages : [])
    ],
    color: '#f1f5f9'
  };

  /* ========= MAIN CONTENT (right column) ========= */
  const objectiveText = 'To work in a reputed organization where I can learn new skills, improve my abilities, and contribute to organizational goals while growing professionally.';

  // Personal details two‑column table
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

  // Education table
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
      e.exam || '—',
      e.board || '—',
      e.year || '—',
      e.percent || '—',
      e.division || '—'
    ]);
  });

  // Other qualifications list
  const qualItems = data.qualifications.map(q => ({
    text: `${q.name || '—'} ${q.institute ? '(' + q.institute + ')' : ''}  |  ${q.year || ''}  ${q.grade ? '| ' + q.grade : ''}  ${q.duration ? '(' + q.duration + ')' : ''}`,
    margin: [0, 2]
  }));

  const declarationText = data.declaration
    ? 'I hereby declare that all the information provided above is true, correct, and complete to the best of my knowledge and belief.'
    : '';

  // Footer
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB');
  const place = data.place || '_______________';

  const mainContent = {
    margin: [25, 25, 25, 25],
    stack: [
      { text: 'OBJECTIVE', fontSize: 14, bold: true, color: '#1e293b', border: [false, false, false, true], borderColor: '#4f46e5', margin: [0,0,0,5], padding: [0,0,0,4] },
      { text: objectiveText, fontSize: 11, color: '#475569', margin: [0,0,0,12] },

      { text: 'PERSONAL DETAILS', fontSize: 14, bold: true, color: '#1e293b', border: [false, false, false, true], borderColor: '#4f46e5', margin: [0,12,0,5], padding: [0,0,0,4] },
      personalCols,

      { text: 'EDUCATIONAL QUALIFICATION', fontSize: 14, bold: true, color: '#1e293b', border: [false, false, false, true], borderColor: '#4f46e5', margin: [0,15,0,5], padding: [0,0,0,4] },
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

      { text: 'OTHER QUALIFICATIONS', fontSize: 14, bold: true, color: '#1e293b', border: [false, false, false, true], borderColor: '#4f46e5', margin: [0,15,0,5], padding: [0,0,0,4] },
      { ul: qualItems.length ? qualItems : [{ text: '—', fontSize: 11 }] },

      { text: 'DECLARATION', fontSize: 14, bold: true, color: '#1e293b', border: [false, false, false, true], borderColor: '#4f46e5', margin: [0,15,0,5], padding: [0,0,0,4] },
      { text: declarationText, fontSize: 11, italics: true, color: '#64748b', margin: [0,0,0,15] },

      // Place / Date / Name
      {
        columns: [
          { width: 'auto', text: 'Place: ' + place, bold: true, fontSize: 11 },
          {
            width: '*',
            alignment: 'right',
            stack: [
              { text: 'Date: ' + dateStr, bold: true, fontSize: 11 },
              { text: '(' + fullName + ')', bold: true, fontSize: 11, margin: [0,4,0,0] }
            ]
          }
        ],
        margin: [0,20,0,0]
      }
    ]
  };

  /* ========= ASSEMBLE FULL PAGE ========= */
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [0, 0, 0, 0],   // we control padding inside the two cells
    content: [
      {
        table: {
          widths: [140, '*'],
          body: [[
            sidebarContent,
            mainContent
          ]]
        },
        layout: 'noBorders'
      }
    ],
    styles: {
      tableHeader: { bold: true, color: '#0f172a' }
    },
    defaultStyle: { font: 'Roboto' }
  };

  pdfMake.createPdf(docDefinition).download(fileName);
}
