// js/templates/template3.js – Classic Professional (circular photo, two‑column, timeline)
function generateTemplate3PDF(data) {
  const p = data.personal;
  const fullName = (p.fullName || 'Your Name').trim();
  const fileName = fullName.replace(/\s+/g, '_') + '.pdf';

  // ---------- PAGE SETTINGS ----------
  const pageWidth = 595.28;
  const leftMargin = 56.7;   // 20mm
  const topMargin = 51;      // 18mm
  const rightMargin = 56.7;
  const bottomMargin = 51;

  const circleDiameter = 200;
  const circleX = leftMargin;
  const circleY = topMargin;
  const radius = circleDiameter / 2;
  const accentColor = '#4f46e5';
  const hasPhoto = data.photo && data.photo.length > 0;

  // ---------- HEADER ELEMENTS (absolute) ----------
  // 1. White circle background (frame)
  const circleBg = {
    canvas: [
      {
        type: 'ellipse',
        x: circleX + radius,
        y: circleY + radius,
        r1: radius,
        r2: radius,
        color: '#ffffff',        // white fill hides photo corners
        lineColor: accentColor,
        lineWidth: 2
      }
    ],
    absolutePosition: { x: 0, y: 0 }
  };

  // 2. Photo (if present) – placed inside the circle, slightly smaller
  const photoOverlay = hasPhoto
    ? {
        image: data.photo,
        width: circleDiameter - 8,
        height: circleDiameter - 8,
        absolutePosition: { x: circleX + 4, y: circleY + 4 }
      }
    : {
        text: 'PHOTO',
        fontSize: 24,
        bold: true,
        color: accentColor,
        absolutePosition: {
          x: circleX + radius - 30,
          y: circleY + radius - 12
        }
      };

  // 3. Name & contact (right of photo)
  const nameX = circleX + circleDiameter + 20;
  const nameY = circleY + 40;   // vertically align with photo centre
  const nameContact = {
    stack: [
      { text: fullName, fontSize: 36, bold: true, color: '#1e293b', margin: [0, 0, 0, 4] },
      {
        text: `Email: ${p.email || ''}  |  Phone: ${p.mobile || ''}`,
        fontSize: 13,
        color: '#475569'
      },
      {
        text: `Address: ${p.address || ''}`,
        fontSize: 13,
        color: '#475569',
        margin: [0, 2, 0, 0]
      }
    ],
    absolutePosition: { x: nameX, y: nameY }
  };

  // 4. Horizontal line under header
  const lineY = circleY + circleDiameter + 20;
  const headerLine = {
    canvas: [
      {
        type: 'line',
        x1: leftMargin,
        y1: lineY,
        x2: pageWidth - rightMargin,
        y2: lineY,
        lineWidth: 2,
        lineColor: '#1e293b'
      }
    ],
    absolutePosition: { x: 0, y: 0 }
  };

  // ---------- SPACER (pushes normal content below the header) ----------
  const spacerHeight = lineY + 25;   // enough to clear the line
  const spacer = {
    canvas: [
      { type: 'rect', x: 0, y: 0, w: 0, h: spacerHeight, color: '#ffffff' }
    ]
  };

  // ---------- HELPERS ----------
  function sectionTitle(text) {
    return {
      text,
      fontSize: 14,
      bold: true,
      color: '#1e293b',
      margin: [0, 18, 0, 10],
      border: [false, false, true, false],
      borderWidth: [0, 0, 2, 0],
      borderColor: ['#ffffff', '#ffffff', '#cbd5e1', '#ffffff'],
      padding: [0, 0, 4, 0]
    };
  }

  function timeline(entries) {
    if (!entries.length) return { text: '—', fontSize: 12, margin: [0, 0, 0, 10] };
    const items = entries.map(entry => ({
      stack: [
        { text: entry.header, bold: true, fontSize: 13, color: '#1e293b', margin: [0, 0, 2, 0] },
        { text: entry.sub1, fontSize: 12, color: '#64748b', margin: [0, 0, 1, 0] },
        ...(entry.sub2 ? [{ text: entry.sub2, fontSize: 12, color: '#64748b', margin: [0, 0, 12, 0] }] : [])
      ],
      margin: [18, 0, 0, 0]
    }));
    return {
      stack: items,
      margin: [0, 0, 0, 10]
    };
  }

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

  function tagRow(tags) {
    if (!tags.length) return { text: '—', fontSize: 11 };
    const cells = tags.map(tag => ({
      text: tag,
      fontSize: 11,
      color: '#1e293b',
      fillColor: '#f1f5f9',
      alignment: 'center',
      margin: [0, 0, 6, 0]
    }));
    return {
      table: {
        widths: Array(tags.length).fill('auto'),
        body: [cells]
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingLeft: () => 10,
        paddingRight: () => 10,
        paddingTop: () => 3,
        paddingBottom: () => 3
      },
      margin: [0, 4, 0, 4]
    };
  }

  // ---------- DATA EXTRACTION ----------
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

  const skillsTags = data.skills || [];
  const langTags = data.languages || [];

  const objectiveText =
    'To work in a reputed organization where I can learn new skills, improve my abilities, and contribute to organizational goals while growing professionally.';
  const declarationText = data.declaration
    ? 'I hereby declare that all the information provided above is true, correct, and complete to the best of my knowledge and belief.'
    : '';

  // ---------- FOOTER ----------
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB');
  const place = data.place || '_______________';
  const footer = {
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
    ],
    margin: [0, 25, 0, 0]
  };

  // ---------- TWO‑COLUMN LAYOUT ----------
  const leftColumn = {
    stack: [
      sectionTitle('EDUCATION'),
      timeline(educationEntries),
      sectionTitle('OTHER QUALIFICATIONS'),
      timeline(qualEntries)
    ]
  };

  const rightColumn = {
    stack: [
      sectionTitle('PERSONAL DETAILS'),
      {
        columns: [
          { width: '48%', stack: [buildPersonalTable(leftPersonal)] },
          { width: '4%', text: '' },
          { width: '48%', stack: [buildPersonalTable(rightPersonal)] }
        ],
        columnGap: 0
      },
      sectionTitle('SKILLS'),
      tagRow(skillsTags),
      sectionTitle('LANGUAGES'),
      tagRow(langTags)
    ]
  };

  const twoColumns = {
    columns: [
      { width: '48%', stack: [leftColumn] },
      { width: '4%', text: '' },
      { width: '48%', stack: [rightColumn] }
    ],
    columnGap: 0
  };

  const fullWidthSection = {
    stack: [
      sectionTitle('OBJECTIVE'),
      { text: objectiveText, fontSize: 13, color: '#475569', lineHeight: 1.5, margin: [0, 0, 0, 12] },
      sectionTitle('DECLARATION'),
      {
        text: declarationText,
        fontSize: 12,
        italics: true,
        color: '#64748b',
        margin: [0, 0, 0, 15],
        border: [true, false, false, false],
        borderWidth: [3, 0, 0, 0],
        borderColor: ['#cbd5e1', '#ffffff', '#ffffff', '#ffffff'],
        paddingLeft: 10
      }
    ],
    margin: [0, 20, 0, 0]
  };

  // ---------- ASSEMBLE DOCUMENT ----------
  const content = [
    // absolute header elements
    circleBg,
    photoOverlay,
    nameContact,
    headerLine,
    // spacer to push body content down
    spacer,
    // body
    twoColumns,
    fullWidthSection,
    footer
  ];

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [leftMargin, topMargin, rightMargin, bottomMargin],
    content,
    defaultStyle: { font: 'Roboto' }
  };

  pdfMake.createPdf(docDefinition).download(fileName);
}
