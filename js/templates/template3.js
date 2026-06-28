// js/templates/template3.js – Classic Professional (circular photo, timeline, two‑column)
function generateTemplate3PDF(data) {
  const p = data.personal;
  const fullName = (p.fullName || 'Your Name').trim();
  const fileName = fullName.replace(/\s+/g, '_') + '.pdf';

  const pageWidth = 595.28;
  const pageHeight = 841.89;

  // ========== CIRCULAR PHOTO ==========
  const circleDiameter = 200;
  const circleX = 56.7;                     // left margin ~20mm
  const circleY = 51;                       // top margin ~18mm
  const hasPhoto = data.photo && data.photo.length > 0;

  // White filled circle with indigo outline (borderless? no border – user said no border)
  const circleCanvas = {
    canvas: [
      { type: 'ellipse', x: circleX + circleDiameter/2, y: circleY + circleDiameter/2, r1: circleDiameter/2, r2: circleDiameter/2, color: '#f1f5f9' }
    ]
  };

  let photoOverlay = null;
  if (hasPhoto) {
    // image fitted inside the circle (inset by 2px to stay within)
    photoOverlay = {
      image: data.photo,
      width: circleDiameter - 4,
      height: circleDiameter - 4,
      absolutePosition: { x: circleX + 2, y: circleY + 2 }
    };
  } else {
    // placeholder text centred
    photoOverlay = {
      text: 'PHOTO',
      fontSize: 24,
      bold: true,
      color: '#475569',
      absolutePosition: { x: circleX + (circleDiameter/2) - 30, y: circleY + (circleDiameter/2) - 12 }
    };
  }

  // ========== HEADER TEXT (name + contact) ==========
  const headerTextX = circleX + circleDiameter + 20;   // to the right of photo
  const headerTextWidth = pageWidth - headerTextX - 56.7;   // right margin same as left

  const headerInfo = {
    stack: [
      { text: fullName, fontSize: 36, bold: true, color: '#0f172a', margin: [0, 0, 0, 4] },
      { text: `Email: ${p.email || ''}  |  Phone: ${p.mobile || ''}`, fontSize: 13, color: '#334155' },
      { text: `Address: ${p.address || ''}`, fontSize: 13, color: '#334155', margin: [0, 2, 0, 0] }
    ],
    absolutePosition: { x: headerTextX, y: circleY + 10 }  // vertically centre with photo
  };

  // ========== UNDERLINE BELOW HEADER ==========
  const headerUnderlineY = circleY + circleDiameter + 25;
  const headerUnderline = {
    canvas: [
      { type: 'line', x1: circleX, y1: headerUnderlineY, x2: pageWidth - 56.7, y2: headerUnderlineY, lineWidth: 2, lineColor: '#1e293b' }
    ]
  };

  // ========== MAIN CONTENT START Y ==========
  const contentStartY = headerUnderlineY + 30;

  // ========== TWO COLUMNS ==========
  const colWidth = (pageWidth - 56.7*2 - 20) / 2;   // 20pt gap
  const leftX = circleX;
  const rightX = leftX + colWidth + 20;

  // ----- Helper: section title with underline -----
  function sectionTitle(text) {
    return {
      text,
      fontSize: 14,
      bold: true,
      color: '#1e293b',
      margin: [0, 0, 0, 10],
      border: [false, false, true, false],
      borderWidth: [0, 0, 2, 0],
      borderColor: ['#ffffff', '#ffffff', '#cbd5e1', '#ffffff'],
      padding: [0, 0, 4, 0]
    };
  }

  // ----- LEFT COLUMN: Education timeline -----
  const educationEntries = data.education.map(e => ({
    header: e.exam || '—',
    sub1: `${e.board || '—'}, ${e.year || '—'}`,
    sub2: `${e.percent || '—'} — ${e.division || '—'}`
  }));

  function buildTimeline(entries) {
    const items = [];
    entries.forEach(entry => {
      items.push({
        stack: [
          { text: entry.header, bold: true, fontSize: 13, color: '#1e293b', margin: [0, 0, 2, 0] },
          { text: entry.sub1, fontSize: 12, color: '#64748b', margin: [0, 0, 1, 0] },
          { text: entry.sub2, fontSize: 12, color: '#64748b', margin: [0, 0, 12, 0] }
        ],
        margin: [18, 0, 0, 0]   // indent for timeline line
      });
    });
    return {
      stack: items,
      margin: [0, 0, 0, 10]
    };
  }

  // Timeline vertical line + dots (drawn via canvas)
  const timelineLineY = contentStartY + 20; // start after first section title
  const timelineDots = [];
  let dotY = timelineLineY + 12;
  educationEntries.forEach(() => {
    timelineDots.push(
      { type: 'ellipse', x: leftX + 8, y: dotY, r1: 5, r2: 5, color: '#4f46e5', lineWidth: 2, lineColor: '#ffffff' }
    );
    dotY += 52;  // approximate height per entry
  });
  const timelineLineCanvas = {
    canvas: [
      { type: 'line', x1: leftX + 8, y1: timelineLineY, x2: leftX + 8, y2: dotY - 10, lineWidth: 2, lineColor: '#e2e8f0' },
      ...timelineDots
    ]
  };

  // Education section (title + timeline)
  const educationSection = {
    stack: [
      sectionTitle('EDUCATION'),
      buildTimeline(educationEntries)
    ],
    absolutePosition: { x: leftX, y: contentStartY }
  };

  // Other qualifications (similarly)
  const qualEntries = data.qualifications.map(q => ({
    header: q.name || '—',
    sub1: `${q.institute || '—'}, ${q.year || '—'}`,
    sub2: `${q.grade || '—'} — ${q.duration || '—'}`
  }));
  const qualY = contentStartY + 20 + 52 * Math.max(educationEntries.length, 1) + 30;
  const otherQualSection = {
    stack: [
      sectionTitle('OTHER QUALIFICATIONS'),
      buildTimeline(qualEntries)
    ],
    absolutePosition: { x: leftX, y: qualY }
  };

  // ----- RIGHT COLUMN: Personal Details, Skills, Languages -----
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

  const personalSection = {
    stack: [
      sectionTitle('PERSONAL DETAILS'),
      buildPersonalTable(personalRows)
    ],
    absolutePosition: { x: rightX, y: contentStartY }
  };

  // Skills / Languages as chips
  function tagRow(tags) {
    if (!tags.length) return { text: '—', fontSize: 11 };
    const cells = tags.map(tag => ({
      text: tag,
      fontSize: 11,
      bold: false,
      color: '#1e293b',
      fillColor: '#f1f5f9',
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
        paddingLeft: () => 10,
        paddingRight: () => 10,
        paddingTop: () => 3,
        paddingBottom: () => 3
      },
      margin: [0, 5, 0, 5]
    };
  }

  const skillsY = contentStartY + 150; // approximate
  const skillsSection = {
    stack: [
      sectionTitle('SKILLS'),
      tagRow(data.skills)
    ],
    absolutePosition: { x: rightX, y: skillsY }
  };
  const languagesSection = {
    stack: [
      sectionTitle('LANGUAGES'),
      tagRow(data.languages)
    ],
    absolutePosition: { x: rightX, y: skillsY + 45 }
  };

  // ========== FULL WIDTH SECTIONS (Objective, Declaration) ==========
  const fullWidthX = leftX;
  const fullWidthY = qualY + 20 + 52 * Math.max(qualEntries.length, 1) + 30;
  const objectiveText = 'To work in a reputed organization where I can learn new skills, improve my abilities, and contribute to organizational goals while growing professionally.';
  const declarationText = data.declaration
    ? 'I hereby declare that all the information provided above is true, correct, and complete to the best of my knowledge and belief.'
    : '';

  const objectiveSection = {
    stack: [
      sectionTitle('OBJECTIVE'),
      { text: objectiveText, fontSize: 13, color: '#475569', lineHeight: 1.5, margin: [0, 0, 0, 10] }
    ],
    absolutePosition: { x: fullWidthX, y: fullWidthY }
  };

  const declarationY = fullWidthY + 50;
  const declarationSection = {
    stack: [
      sectionTitle('DECLARATION'),
      { text: declarationText, fontSize: 12, italics: true, color: '#64748b', margin: [0, 0, 0, 10], border: [true, false, false, false], borderWidth: [3, 0, 0, 0], borderColor: ['#cbd5e1', '#ffffff', '#ffffff', '#ffffff'], paddingLeft: 10 }
    ],
    absolutePosition: { x: fullWidthX, y: declarationY }
  };

  // ========== FOOTER ==========
  const footerY = declarationY + 60;
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB');
  const place = data.place || '_______________';

  const footerLine = {
    stack: [
      {
        columns: [
          { width: 'auto', text: 'Place: ' + place, bold: true, fontSize: 13 },
          {
            width: '*',
            alignment: 'right',
            stack: [
              { text: 'Date: ' + dateStr, bold: true, fontSize: 13 },
              { text: '(' + fullName + ')', bold: true, fontSize: 13, margin: [0, 4, 0, 0] }
            ]
          }
        ]
      }
    ],
    absolutePosition: { x: fullWidthX, y: footerY }
  };

  // Footer underline (top)
  const footerUnderlineY = footerY - 10;
  const footerUnderline = {
    canvas: [
      { type: 'line', x1: fullWidthX, y1: footerUnderlineY, x2: pageWidth - 56.7, y2: footerUnderlineY, lineWidth: 1, lineColor: '#e2e8f0' }
    ]
  };

  // ========== ASSEMBLE DOCUMENT ==========
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [0, 0, 0, 0],
    content: [
      // Circle photo
      circleCanvas,
      photoOverlay,
      // Header info
      headerInfo,
      headerUnderline,
      // Timeline line (behind text)
      timelineLineCanvas,
      // Left column
      educationSection,
      otherQualSection,
      // Right column
      personalSection,
      skillsSection,
      languagesSection,
      // Full width
      objectiveSection,
      declarationSection,
      // Footer
      footerUnderline,
      footerLine
    ],
    defaultStyle: { font: 'Roboto' }
  };

  pdfMake.createPdf(docDefinition).download(fileName);
}
