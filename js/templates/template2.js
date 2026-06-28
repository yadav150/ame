// js/templates/template2.js – Elegant Header (matching independent HTML exactly)
function generateTemplate2PDF(data) {
  const p = data.personal;
  const fullName = (p.fullName || 'Your Name').trim();
  const fileName = fullName.replace(/\s+/g, '_') + '.pdf';

  const pageWidth = 595.28;   // A4 width in pt
  const pageHeight = 841.89;  // A4 height in pt

  // ========== TOP BAND (canvas) ==========
  const bandHeight = 90;
  const topBand = {
    canvas: [
      { type: 'rect', x: 0, y: 0, w: pageWidth, h: bandHeight, color: '#4f46e5' }
    ]
  };

  // ========== CIRCLE PHOTO (absolute) ==========
  const circleDiameter = 120;
  const circleX = (pageWidth - circleDiameter) / 2;
  const circleY = 30;
  const hasPhoto = data.photo && data.photo.length > 0;

  // Draw circle border (white fill, indigo border) + optional image
  const circleElements = [
    { type: 'ellipse', x: circleX + circleDiameter/2, y: circleY + circleDiameter/2, r1: circleDiameter/2, r2: circleDiameter/2, color: '#ffffff', lineWidth: 4, lineColor: '#ffffff' },
    { type: 'ellipse', x: circleX + circleDiameter/2, y: circleY + circleDiameter/2, r1: circleDiameter/2, r2: circleDiameter/2, lineWidth: 4, lineColor: '#4f46e5' } // border
  ];

  const circleCanvas = {
    canvas: circleElements,
    absolutePosition: { x: 0, y: 0 }
  };

  let photoOverlay = null;
  if (hasPhoto) {
    // Place image inside the circle, slightly smaller to fit within border
    photoOverlay = {
      image: data.photo,
      width: circleDiameter - 8,
      height: circleDiameter - 8,
      absolutePosition: { x: circleX + 4, y: circleY + 4 }
    };
  } else {
    // Place "PHOTO" text in the circle center
    photoOverlay = {
      text: 'PHOTO',
      fontSize: 16,
      bold: true,
      color: '#4f46e5',
      absolutePosition: { x: circleX + (circleDiameter/2) - 20, y: circleY + (circleDiameter/2) - 10 }
    };
  }

  // ========== NAME & CONTACT (positioned below circle) ==========
  const nameMarginTop = bandHeight + 70; // 90 + 70 = 160pt
  const headerInfo = {
    stack: [
      { text: fullName, fontSize: 30, bold: true, color: '#1e293b', alignment: 'center', margin: [0, 0, 0, 6] },
      { text: `Email: ${p.email || ''}  |  Phone: ${p.mobile || ''}`, fontSize: 13, color: '#475569', alignment: 'center' },
      { text: `Address: ${p.address || ''}`, fontSize: 13, color: '#475569', alignment: 'center', margin: [0, 2, 0, 0] }
    ],
    margin: [30, nameMarginTop, 30, 0]   // left/right padding, top push
  };

  // ========== MAIN CONTENT ==========
  const objectiveText = 'To work in a reputed organization where I can learn new skills, improve my abilities, and contribute to organizational goals while growing professionally.';

  // Section title with underline
  function sectionTitle(text) {
    return {
      text,
      fontSize: 15,
      bold: true,
      color: '#1e293b',
      background: '#f1f5f9',
      padding: [5, 12, 5, 12],
      margin: [0, 22, 0, 8],
      border: [true, false, false, false],   // left border
      borderWidth: [4, 0, 0, 0],
      borderColor: ['#4f46e5', '#ffffff', '#ffffff', '#ffffff']
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
          { text: l + ':', bold: true, color: '#334155', fontSize: 12 },
          { text: v, color: '#1e293b', fontSize: 12, alignment: 'right' }
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
      { text: e.exam || '—', fontSize: 11 },
      { text: e.board || '—', fontSize: 11 },
      { text: e.year || '—', fontSize: 11 },
      { text: e.percent || '—', fontSize: 11 },
      { text: e.division || '—', fontSize: 11 }
    ]);
  });

  // Other qualifications table
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
      { text: q.name || '—', fontSize: 11 },
      { text: q.institute || '—', fontSize: 11 },
      { text: q.year || '—', fontSize: 11 },
      { text: q.grade || '—', fontSize: 11 },
      { text: q.duration || '—', fontSize: 11 }
    ]);
  });

  // Skills & Languages as rounded tags
  function tagRow(tags) {
    if (!tags.length) return { text: '—', fontSize: 11 };
    const cells = tags.map(tag => ({
      text: tag,
      fontSize: 11,
      bold: false,
      color: '#4338ca',
      fillColor: '#eef2ff',
      alignment: 'center',
      margin: [0, 0, 6, 0]
    }));
    return {
      table: {
        widths: Array(tags.length).fill('auto'),
        body: [ cells ]
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingLeft: () => 10,
        paddingRight: () => 10,
        paddingTop: () => 3,
        paddingBottom: () => 3,
        fillColor: () => null,
        hLineColor: () => '#ffffff',
        vLineColor: () => '#ffffff'
      },
      margin: [0, 8, 0, 8]
    };
  }

  const skillsTags = data.skills.length ? data.skills : [];
  const languagesTags = data.languages.length ? data.languages : [];

  // Declaration
  const declarationText = data.declaration
    ? 'I hereby declare that all the information provided above is true, correct, and complete to the best of my knowledge and belief.'
    : '';

  // Footer
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB');
  const place = data.place || '_______________';

  const mainContent = {
    stack: [
      sectionTitle('OBJECTIVE'),
      { text: objectiveText, fontSize: 12, color: '#334155', margin: [0, 0, 0, 12], lineHeight: 1.5 },

      sectionTitle('PERSONAL DETAILS'),
      personalCols,

      sectionTitle('EDUCATIONAL QUALIFICATION'),
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', 'auto', 'auto', 'auto'],
          body: eduBody
        },
        layout: {
          fillColor: function (i) { return i === 0 ? '#f8fafc' : null; },
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#cbd5e1',
          vLineColor: () => '#cbd5e1',
          paddingLeft: () => 8,
          paddingRight: () => 8,
          paddingTop: () => 7,
          paddingBottom: () => 7
        }
      },

      sectionTitle('SKILLS'),
      tagRow(skillsTags),

      sectionTitle('LANGUAGES KNOWN'),
      tagRow(languagesTags),

      sectionTitle('OTHER QUALIFICATIONS'),
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', 'auto', 'auto', 'auto'],
          body: qualBody
        },
        layout: {
          fillColor: function (i) { return i === 0 ? '#f8fafc' : null; },
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#cbd5e1',
          vLineColor: () => '#cbd5e1',
          paddingLeft: () => 8,
          paddingRight: () => 8,
          paddingTop: () => 7,
          paddingBottom: () => 7
        }
      },

      sectionTitle('DECLARATION'),
      { text: declarationText, fontSize: 11, italics: true, color: '#64748b', margin: [0, 0, 0, 15], border: [true, false, false, false], borderWidth: [3, 0, 0, 0], borderColor: ['#cbd5e1', '#ffffff', '#ffffff', '#ffffff'], paddingLeft: 10 },

      // Place / Date / Name
      {
        columns: [
          { width: 'auto', text: 'Place: ' + place, bold: true, fontSize: 12 },
          {
            width: '*',
            alignment: 'right',
            stack: [
              { text: 'Date: ' + dateStr, bold: true, fontSize: 12 },
              { text: '(' + fullName + ')', bold: true, fontSize: 12, margin: [0, 4, 0, 0] }
            ]
          }
        ],
        margin: [0, 25, 0, 0]
      }
    ],
    margin: [30, 0, 30, 30]  // left/right/bottom padding for the main body
  };

  // ========== ASSEMBLE DOCUMENT ==========
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [0, 0, 0, 0],   // we handle margins manually
    content: [
      // Background band and circle (absolute positioned)
      topBand,
      circleCanvas,
      photoOverlay,
      // Header info (name + contact)
      headerInfo,
      // Main content
      mainContent
    ],
    styles: {
      tableHeader: { bold: true, color: '#0f172a', fontSize: 11 }
    },
    defaultStyle: { font: 'Roboto' }
  };

  pdfMake.createPdf(docDefinition).download(fileName);
}
