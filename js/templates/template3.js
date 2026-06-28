// js/templates/template3.js – Classic Professional (synchronous, circular photo from cropper)
function generateTemplate3PDF(data) {
  const p = data.personal;
  const fullName = (p.fullName || 'Your Name').trim();
  const fileName = fullName.replace(/\s+/g, '_') + '.pdf';

  // ---------- Header (circular photo, already cropped) ----------
  const hasPhoto = data.photo && data.photo.length > 0;
  const circleDiameter = 160;

  // White circle background (gives the frame effect)
  const circleBg = {
    canvas: [
      { type: 'ellipse', x: circleDiameter/2, y: circleDiameter/2, r1: circleDiameter/2, r2: circleDiameter/2, color: '#f1f5f9', lineWidth: 2, lineColor: '#4f46e5' }
    ],
    width: circleDiameter,
    height: circleDiameter,
    margin: [0, 0, 15, 0]
  };

  // Photo (already circular, just place it without mask)
  const photoCell = hasPhoto
    ? { image: data.photo, width: circleDiameter, height: circleDiameter, margin: [0, 0, 15, 0] }
    : circleBg;   // if no photo, show only the grey circle

  const textTopMargin = (circleDiameter - 54) / 2;

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
          margin: [0, textTopMargin, 0, 0]
        }
      ]]
    },
    layout: 'noBorders',
    margin: [0, 18, 0, 15]
  };

  const headerUnderline = {
    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: '#1e293b' }],
    margin: [0, 0, 0, 18]
  };

  // ---------- Section title (rounded blue accent bar) ----------
  function sectionHeader(text) {
    return {
      table: {
        widths: [10, '*'],
        body: [[
          {
            canvas: [{ type: 'rect', x: 0, y: 0, w: 10, h: 14, r: 5, color: '#4f46e5' }],
            margin: [0, 2, 0, 0],
            border: [false, false, false, false]
          },
          {
            text,
            bold: true,
            fontSize: 13,
            color: '#4f46e5',
            fillColor: '#f8fafc',
            margin: [6, 2, 0, 2],
            border: [false, false, false, false]
          }
        ]]
      },
      layout: 'noBorders',
      margin: [0, 12, 0, 4]
    };
  }

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
      { width: '48%', stack: [buildPersonalTable(leftPersonal)] },
      { width: '4%', text: '' },
      { width: '48%', stack: [buildPersonalTable(rightPersonal)] }
    ],
    columnGap: 0
  };

  function buildTimeline(entries) {
    if (!entries.length) return { text: '—', fontSize: 10, margin: [0, 4, 0, 8] };
    const body = [];
    entries.forEach((entry, idx) => {
      body.push([
        {
          canvas: [
            { type: 'ellipse', x: 5, y: 5, r1: 4, r2: 4, color: '#4f46e5' },
            ...(idx < entries.length - 1 ? [{ type: 'rect', x: 4.5, y: 9, w: 1, h: 20, color: '#e2e8f0' }] : [])
          ],
          width: 10,
          border: [false, false, false, false],
          margin: [0, 2, 0, 0]
        },
        {
          stack: [
            { text: entry.header, bold: true, fontSize: 11, color: '#1e293b', margin: [0, 0, 1, 0] },
            { text: entry.sub1, fontSize: 10, color: '#64748b', margin: [0, 0, 0, 0] },
            ...(entry.sub2 ? [{ text: entry.sub2, fontSize: 10, color: '#64748b', margin: [0, 0, 0, 0] }] : [])
          ],
          margin: [4, 0, 0, 10]
        }
      ]);
    });
    return {
      table: {
        widths: [10, '*'],
        body: body
      },
      layout: 'noBorders',
      margin: [0, 2, 0, 6]
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

  function buildTagRow(tags, color, bgColor) {
    if (!tags.length) return { text: '—', fontSize: 10 };
    const cells = tags.map(tag => ({
      text: tag,
      fontSize: 9,
      bold: false,
      color: color,
      fillColor: bgColor,
      alignment: 'center',
      margin: [0, 0, 3, 0]
    }));
    return {
      table: {
        widths: Array(tags.length).fill('auto'),
        body: [cells]
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingLeft: () => 5,
        paddingRight: () => 5,
        paddingTop: () => 2,
        paddingBottom: () => 2,
        fillColor: () => null
      },
      margin: [0, 2, 0, 6]
    };
  }

  const skillsTags = data.skills.length ? data.skills : [];
  const langTags = data.languages.length ? data.languages : [];

  const declarationText = data.declaration
    ? 'I hereby declare that the information provided above is true and correct to the best of my knowledge and belief.'
    : '';

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB');
  const place = data.place || '_______________';

  const leftColumn = {
    stack: [
      sectionHeader('EDUCATION'),
      buildTimeline(educationEntries)
    ]
  };

  const rightColumn = {
    stack: [
      sectionHeader('PERSONAL DETAILS'),
      personalCols,
      sectionHeader('SKILLS'),
      buildTagRow(skillsTags, '#4338ca', '#eef2ff'),
      sectionHeader('LANGUAGES KNOWN'),
      buildTagRow(langTags, '#4338ca', '#eef2ff')
    ]
  };

  const twoColumns = {
    columns: [
      { width: '48%', stack: [leftColumn] },
      { width: '4%', text: '' },
      { width: '48%', stack: [rightColumn] }
    ],
    columnGap: 0,
    margin: [0, 0, 0, 12]
  };

  const fullWidthSection = {
    stack: [
      sectionHeader('OTHER QUALIFICATIONS'),
      buildTimeline(qualEntries),
      sectionHeader('OBJECTIVE'),
      { text: 'To work in a reputed organization where I can learn new skills, improve my abilities, and contribute to organizational goals while growing professionally.', fontSize: 10, color: '#334155', lineHeight: 1.4, margin: [4, 0, 0, 10] },
      sectionHeader('DECLARATION'),
      { text: declarationText, fontSize: 10, italics: true, color: '#475569', margin: [4, 0, 0, 12] },
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
        margin: [0, 6, 0, 0]
      }
    ]
  };

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [56.7, 45, 56.7, 45],
    content: [
      headerTable,
      headerUnderline,
      twoColumns,
      fullWidthSection
    ],
    defaultStyle: { font: 'Roboto' }
  };

  pdfMake.createPdf(docDefinition).download(fileName);
}
