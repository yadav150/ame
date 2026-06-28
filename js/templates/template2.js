// js/templates/template2.js – Elegant Header (fixed layout, exact match)
function generateTemplate2PDF(data) {
  const p = data.personal;
  const fullName = (p.fullName || 'Your Name').trim();
  const fileName = fullName.replace(/\s+/g, '_') + '.pdf';

  const pageWidth = 595.28;
  const pageHeight = 841.89;

  // ========== COLORS ==========
  const bandColor = '#4f46e5';
  const lightBg = '#f1f5f9';
  const borderColor = '#cbd5e1';
  const darkText = '#1e293b';
  const secondaryText = '#475569';
  const accentColor = '#4f46e5';

  // ========== TOP BAND ==========
  const bandHeight = 90;
  const topBandCanvas = {
    canvas: [
      { type: 'rect', x: 0, y: 0, w: pageWidth, h: bandHeight, color: bandColor }
    ]
  };

  // ========== CIRCULAR PHOTO ==========
  const circleDiameter = 120;               // exact match to original CSS
  const circleX = (pageWidth - circleDiameter) / 2;  // centered
  const circleY = 30;                       // 30pt from top (like CSS top:30px)
  const hasPhoto = data.photo && data.photo.length > 0;

  // White circle background
  const circleBackground = {
    canvas: [
      { type: 'ellipse', x: circleX + circleDiameter/2, y: circleY + circleDiameter/2, r1: circleDiameter/2, r2: circleDiameter/2, color: '#ffffff' }
    ]
  };

  // Photo image (inset by 2px to stay within the circle)
  let photoOverlay = null;
  if (hasPhoto) {
    photoOverlay = {
      image: data.photo,
      width: circleDiameter - 4,
      height: circleDiameter - 4,
      absolutePosition: { x: circleX + 2, y: circleY + 2 }
    };
  } else {
    // Placeholder text centered inside the circle
    photoOverlay = {
      text: 'PHOTO',
      fontSize: 16,
      bold: true,
      color: accentColor,
      absolutePosition: { x: circleX + (circleDiameter/2) - 20, y: circleY + (circleDiameter/2) - 10 }
    };
  }

  // ========== HEADER INFO (name, contact) ==========
  const headerInfoY = circleY + circleDiameter + 10;  // 30+120+10 = 160pt
  const headerInfo = {
    stack: [
      { text: fullName, fontSize: 30, bold: true, color: darkText, alignment: 'center', margin: [0, 0, 0, 6] },
      { text: `Email: ${p.email || ''}  |  Phone: ${p.mobile || ''}`, fontSize: 13, color: secondaryText, alignment: 'center' },
      { text: `Address: ${p.address || ''}`, fontSize: 13, color: secondaryText, alignment: 'center', margin: [0, 2, 0, 0] }
    ],
    absolutePosition: { x: 56.7, y: headerInfoY },  // left margin 20mm
    width: pageWidth - 2 * 56.7
  };

  // ========== MAIN BODY (starts after header) ==========
  const bodyStartY = headerInfoY + 60;   // approx 220pt – after name + contact block
  const colWidth = (pageWidth - 2 * 56.7 - 20) / 2;  // two columns with 20pt gap
  const leftX = 56.7;
  const rightX = leftX + colWidth + 20;

  // ----- Helper: section title with left accent bar -----
  function sectionTitle(text) {
    return {
      text,
      fontSize: 15,
      bold: true,
      color: darkText,
      background: lightBg,
      padding: [5, 12, 5, 12],
      margin: [0, 22, 0, 8],
      border: [true, false, false, false],       // left border
      borderWidth: [4, 0, 0, 0],
      borderColor: [accentColor, '#ffffff', '#ffffff', '#ffffff']
    };
  }

  // ----- Helper: rounded table wrapper -----
  function roundedTable(body, widths, headerRows = 1) {
    return {
      table: {
        headerRows: headerRows,
        widths: widths,
        body: body
      },
      layout: {
        fillColor: function (i) { return i === 0 ? lightBg : null; },
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => borderColor,
        vLineColor: () => borderColor,
        paddingLeft: () => 8,
        paddingRight: () => 8,
        paddingTop: () => 6,
        paddingBottom: () => 6
      }
    };
  }

  // ========== LEFT COLUMN: Education & Other Qualifications ==========
  const educationHeader = [
    { text: 'Exam', style: 'tableHeader' },
    { text: 'University', style: 'tableHeader' },
    { text: 'Year', style: 'tableHeader' },
    { text: 'Percentage', style: 'tableHeader' },
    { text: 'Division', style: 'tableHeader' }
  ];
  const educationRows = [educationHeader];
  data.education.forEach(e => {
    educationRows.push([
      { text: e.exam || '—', fontSize: 11 },
      { text: e.board || '—', fontSize: 11 },
      { text: e.year || '—', fontSize: 11 },
      { text: e.percent || '—', fontSize: 11 },
      { text: e.division || '—', fontSize: 11 }
    ]);
  });

  const qualHeader = [
    { text: 'Qualification', style: 'tableHeader' },
    { text: 'Institute', style: 'tableHeader' },
    { text: 'Year', style: 'tableHeader' },
    { text: 'Grade', style: 'tableHeader' },
    { text: 'Duration', style: 'tableHeader' }
  ];
  const qualRows = [qualHeader];
  data.qualifications.forEach(q => {
    qualRows.push([
      { text: q.name || '—', fontSize: 11 },
      { text: q.institute || '—', fontSize: 11 },
      { text: q.year || '—', fontSize: 11 },
      { text: q.grade || '—', fontSize: 11 },
      { text: q.duration || '—', fontSize: 11 }
    ]);
  });

  // ========== RIGHT COLUMN: Personal Details, Skills, Languages ==========
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
  const leftPersonal = personalRows.slice(0, half);
  const rightPersonal = personalRows.slice(half);

  function buildPersonalTable(rows) {
    return {
      table: {
        widths: ['*', '*'],
        body: rows.map(([l, v]) => [
          { text: l + ':', bold: true, color: '#334155', fontSize: 12 },
          { text: v, color: darkText, fontSize: 12, alignment: 'right' }
        ])
      },
      layout: 'noBorders',
      margin: [0, 2, 0, 2]
    };
  }

  const personalCols = {
    columns: [
      { width: '48%', stack: [ buildPersonalTable(leftPersonal) ] },
      { width: '4%', text: '' },
      { width: '48%', stack: [ buildPersonalTable(rightPersonal) ] }
    ],
    columnGap: 0
  };

  // Skills & Languages as tag chips
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
        fillColor: () => null
      },
      margin: [0, 4, 0, 4]
    };
  }

  // ========== FULL WIDTH: Objective & Declaration ==========
  const objectiveText = 'To work in a reputed organization where I can learn new skills, improve my abilities, and contribute to organizational goals while growing professionally.';
  const declarationText = data.declaration
    ? 'I hereby declare that all the information provided above is true, correct, and complete to the best of my knowledge and belief.'
    : '';

  // ========== FOOTER ==========
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB');
  const place = data.place || '_______________';

  // ========== POSITIONING (absolute) ==========
  const currentY = bodyStartY;   // we'll use absolute positioning for sections to maintain exact layout
  const leftColY = currentY;
  const rightColY = currentY;

  // Build content using columns for the two-column layout.
  // We'll create a single table with two columns for the main body.
  const leftColumnStack = [
    sectionTitle('EDUCATION'),
    roundedTable(educationRows, ['*', '*', 'auto', 'auto', 'auto']),
    { margin: [0, 20, 0, 0] },   // spacer
    sectionTitle('OTHER QUALIFICATIONS'),
    roundedTable(qualRows, ['*', '*', 'auto', 'auto', 'auto'])
  ];

  const rightColumnStack = [
    sectionTitle('PERSONAL DETAILS'),
    personalCols,
    { margin: [0, 20, 0, 0] },
    sectionTitle('SKILLS'),
    tagRow(data.skills),
    { margin: [0, 10, 0, 0] },
    sectionTitle('LANGUAGES KNOWN'),
    tagRow(data.languages),
    { margin: [0, 20, 0, 0] }
  ];

  const fullWidthStack = [
    sectionTitle('OBJECTIVE'),
    { text: objectiveText, fontSize: 12, color: secondaryText, lineHeight: 1.5, margin: [0, 0, 0, 12] },
    sectionTitle('DECLARATION'),
    { text: declarationText, fontSize: 11, italics: true, color: '#64748b', margin: [0, 0, 0, 15], border: [true, false, false, false], borderWidth: [3, 0, 0, 0], borderColor: [borderColor, '#ffffff', '#ffffff', '#ffffff'], paddingLeft: 10 }
  ];

  const footerStack = {
    stack: [
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
        ]
      },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: pageWidth - 2 * 56.7, y2: 0, lineWidth: 1, lineColor: borderColor }], margin: [0, 10, 0, 0] }
    ]
  };

  // ========== ASSEMBLE DOCUMENT ==========
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [56.7, 0, 56.7, 56.7],   // top margin 0 because we handle absolute positions, bottom margin for footer
    content: [
      // Top band (absolute)
      topBandCanvas,
      circleBackground,
      photoOverlay,
      // Header info (absolute)
      headerInfo,

      // Two-column body
      {
        columns: [
          { width: colWidth, stack: leftColumnStack },
          { width: 20, text: '' },
          { width: colWidth, stack: rightColumnStack }
        ],
        margin: [0, 20, 0, 0],
        absolutePosition: { x: 56.7, y: bodyStartY }  // this might not be necessary if we use normal flow; but absolutePosition on a content item is tricky. Instead we'll rely on normal flow by setting margin top after the header.
      }
    ],
    styles: {
      tableHeader: { bold: true, color: '#0f172a', fontSize: 11 }
    },
    defaultStyle: { font: 'Roboto' }
  };

  pdfMake.createPdf(docDefinition).download(fileName);
}
