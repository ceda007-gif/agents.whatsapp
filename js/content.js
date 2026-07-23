/* Default content model for the Hotel Perla group quote page.
   Shape mirrors the accordion sections of the original design. */
window.DEFAULT_ASSETS = {
  hero: 'assets/hero-exterior.jpg',
  logo: 'assets/perla-logo.png',
  roomDouble: 'assets/room-double.jpg',
  roomKing: 'assets/room-king.jpg',
  courtyard: 'assets/courtyard.jpg',
  lobby: 'assets/lobby.jpg',
  pool: 'assets/pool.jpg',
  beach1: 'assets/beach1.jpg',
  beach2: 'assets/beach2.jpg',
  beach3: 'assets/beach3.jpg',
  exteriorBuilding: 'assets/exterior-building.jpg'
};

window.DEFAULT_CONTENT = {
  es: {
    hero: {
      eyebrow: 'Bienestar y equilibrio en el corazón de La Paz',
      headline: 'Propuesta de Grupo'
    },
    meta: {
      contactLabel: 'Contacto', contact: 'Ximena Morales',
      companyLabel: 'Empresa / Grupo', company: 'DMC Meetings · Grupo Empresarial',
      datesLabel: 'Fechas del grupo', dates: '01 al 03 de diciembre, 2026',
      dateLabel: 'Fecha', date: 'La Paz, BCS · 15 jul 2026'
    },
    intro: 'Estamos encantados de que haya considerado el Hotel Perla La Paz, Tapestry Collection by Hilton, para la estancia de su grupo. Un icónico hotel lifestyle y boutique Art Deco ubicado en el corazón de La Paz, Baja California Sur, con vistas impresionantes al Mar de Cortés —conocido por Jacques Cousteau como "el acuario natural del mundo". Con 90 habitaciones y suites, combinamos el encanto histórico con el confort moderno, a tan solo 20 minutos del Aeropuerto Internacional de La Paz.',
    tapHint: 'Toca una sección para ver el detalle',
    rates: {
      enabled: true,
      title: 'Tarifas y Condiciones',
      checkInLabel: 'Check-in', checkIn: '01 de diciembre, 2026',
      checkOutLabel: 'Check-out', checkOut: '03 de diciembre, 2026',
      tableHeaders: { category: 'Categoría', col1: '1 dic', col2: '2 dic', totalRooms: 'Total hab.', rate: 'Tarifa', subtotal: 'Subtotal' },
      rows: [
        { category: 'Habitación Doble', day1: '10', day2: '10', totalRooms: '20', rate: '$4,500.00', subtotal: '$5,707.12' }
      ],
      footnote: 'Salida el 3 de diciembre. Incluye impuestos ($900.00), saneamiento ambiental ($82.12) y servicio ($225.00) por habitación/noche. Tarifas en pesos mexicanos (MXN).',
      grandTotalLabel: 'Gran total de hospedaje',
      grandTotalSub: '20 habitaciones · 2 noches',
      grandTotalAmount: '$114,142.40',
      grandTotalCurrency: 'MXN',
      concessionsLabel: 'Concesiones para el grupo',
      concessions: [
        'Bebida de bienvenida al registrarse',
        'Revelación diaria: café de la mañana, té y pan dulce',
        'Acceso a actividades diarias del Calendario de estilo de vida de Perla, según disponibilidad',
        'Wi-Fi de cortesía durante toda la estadía',
        'Tarifa grupal extendida 2 días antes y 2 después de las fechas oficiales, según disponibilidad',
        'Servicios de estacionamiento de cortesía',
        'Hilton Honors: 1 punto por dólar gastado, aplicable solo a habitaciones',
        'Tarifa de habitaciones comisionable al 10% antes de impuestos'
      ]
    },
    agenda: {
      enabled: true,
      title: 'Agenda Estimada',
      intro: 'Propuesta comercial de alimentos, bebidas y transporte para el grupo. Tarifas en pesos mexicanos (MXN).',
      items: [
        { visible: true, event: 'Transporte redondo Aeropuerto / Hotel', day: 'TBD', time: 'TBD', place: 'Aeropuerto - Hotel', pax: '20', total: '$5,200.00', description: 'Traslado redondo en camioneta Sprinter para 20 personas y 15 maletas. Exenta de impuestos por traslados locales; se factura con IVA en 0.' },
        { visible: true, event: 'Menú Ejecutivo · Día 1', day: 'Día 1', time: 'TBD', place: 'Rest. Terraza', pax: '20', total: '$39,300.00', description: 'Desayuno Americano, Menú del Mediodía 2 tiempos, Cena Menú Especial Perla 3 tiempos.' },
        { visible: true, event: 'Coffee Break', day: 'TBD', time: '6 horas', place: 'Salón El Mechudo', pax: '20', total: '$9,600.00', description: 'Coffee break básico continuo por 6 horas para 20 personas.' },
        { visible: true, event: 'Menú Ejecutivo · Día 2', day: 'Día 2', time: 'TBD', place: 'Rest. Terraza', pax: '20', total: '$39,300.00', description: 'Desayuno Americano, Menú del Mediodía 2 tiempos, Cena Menú Especial Perla 3 tiempos.' },
        { visible: true, event: 'Cena de fin de año', day: 'TBD', time: '4 horas', place: 'Terraza Madre Perla', pax: '20', total: '$38,706.40', description: 'Barra libre Nacional (Margarita, Paloma, Charro Negro, Michelada, Tequila Centenario Blanco, Brandy Torres, Ron Bacardí Blanco, Vodka Smirnoff, Whisky Johnny Walker Red Label). Incluye espacio y montaje especial de banquete: mesa redonda, silla tipo crossback, manteles, servilletas, copa y plato base.' }
      ],
      totalLabel: 'Total agenda estimada',
      totalAmount: '$132,106.40',
      totalCurrency: 'MXN'
    },
    rooms: {
      enabled: true,
      title: 'Habitaciones',
      intro: '90 habitaciones diseñadas para brindar confort, sofisticación y una auténtica conexión con el destino, disponibles en categorías sencilla, doble, Jr. Suite y Master Suite.',
      types: [
        { visible: true, imageKey: 'roomDouble', alt: '2 camas dobles', title: '2 Camas Dobles (38 habitaciones)', size: '25.08 m² / 270 sq ft' },
        { visible: true, imageKey: 'roomKing', alt: '1 cama king con terraza', title: '1 Cama King con Terraza (48 habitaciones)', size: '30.93 m² / 333 sq ft · terraza privada' }
      ],
      amenitiesLabel: 'En todas las habitaciones',
      amenities: [
        'Balcón o terraza privada', 'Aire acondicionado', 'Caja de seguridad con capacidad para laptop', 'Cafetera Nespresso',
        'Minibar de cortesía', 'Kit de planchado', 'Secadora de cabello', 'Espejo de vanidad iluminado',
        'Regadera tipo lluvia', 'Amenidades exclusivas de baño', 'Sandalias y bolsa de playa', 'Internet inalámbrico'
      ]
    },
    amenities: {
      enabled: true,
      title: 'Amenidades y Experiencias',
      hotelAmenitiesLabel: 'Amenidades del hotel',
      hotelAmenities: [
        'Alberca en la azotea', 'Servicio a la habitación', 'Business center', 'Restaurante',
        'Servicio de lavandería', 'Espacio para eventos', 'Fitness center y yoga', 'Habitaciones accesibles'
      ],
      activitiesLabel: 'Actividades Signature Perla',
      activityGroups: [
        { title: 'Bajo impacto', items: ['Yoga: Vinyasa, Hatha, Kundalini', 'Meditación + Activación energética'] },
        { title: 'Alto impacto', items: ['Entrenamiento con toalla', 'Boot Camp', 'Jogging'] },
        { title: 'Tours', items: ['Caminata Centro Histórico', 'Tour Instagram / bici', 'Isla Espíritu Santo y Balandra'] },
        { title: 'Gastronomía', items: ['Cata de café con maridaje de origen', 'Clase de ceviche', 'Cata de vino', 'Clase de shot de mezcal', 'Poolside pampering', 'Coctel al atardecer'] }
      ],
      tourCaption: 'Tours y experiencias por el Mar de Cortés'
    },
    venues: {
      enabled: true,
      title: 'Espacios para Eventos',
      intro: 'Cinco espacios versátiles para juntas, presentaciones y eventos sociales, con montajes disponibles bajo solicitud.',
      list: [
        { name: 'Madre Perla', size: '112.3 m² / 1,208 sq ft' },
        { name: 'Mechudo Meeting Room', size: '95.95 m² / 1,033 sq ft' },
        { name: 'Interior Courtyard', size: '318 m² / 3,423 sq ft' },
        { name: 'Main Restaurant', size: '213.10 m² / 2,294 sq ft' },
        { name: 'La Terraza Café', size: '145.36 m² / 1,564 sq ft' }
      ]
    },
    policies: {
      enabled: true,
      title: 'Políticas del Hotel',
      quickFacts: [
        { label: 'Check-in', value: '3:00 PM' },
        { label: 'Check-out', value: '12:00 PM' },
        { label: 'Menores', value: '17 años o menos' },
        { label: 'Mascotas', value: 'Sí aceptamos' }
      ],
      blocks: [
        { title: 'Especificación de tarifa', text: 'Tarifas por habitación por noche en pesos mexicanos (MXN), ocupación sencilla o doble, plan europeo (no incluye alimentos). Sujetas al 20% de impuestos, 5% de servicio y tarifa de Saneamiento Ambiental. Los impuestos los establece el Gobierno y pueden cambiar sin previo aviso; el cargo por servicio (5%) fue negociado por el sindicato local y no se puede renunciar ni negociar.' },
        { title: 'Política de pago', text: '30% del monto total al firmar el contrato. 50% del total 45 días antes de la llegada. 20% del total 15 días antes de la llegada.' },
        { title: 'Política de cancelación', text: 'El depósito inicial será retenido en caso de cancelación del grupo en cualquier momento. En cancelaciones con 30 días de anticipación aplicará el 100% del monto contratado, incluyendo impuestos y servicios.' },
        { title: 'Política de no-show', text: 'No-shows, salidas anticipadas o noches no usadas no serán reembolsadas; se realizará el cargo por la estancia completa. Todas las cuentas deben cubrirse antes de la salida, en efectivo o con tarjeta de crédito/débito.' }
      ]
    },
    contact: {
      enabled: true,
      title: 'Contacto',
      hotelName: 'Hotel Perla La Paz, Tapestry Collection by Hilton',
      addressLine1: 'Paseo Álvaro Obregón 1570, Zona Central',
      addressLine2: '23000 La Paz, B.C.S.',
      contactName: 'Cecilia Ruvalcaba',
      contactTitle: 'Ejecutiva de Ventas',
      contactEmail: 'sales.executive@hotelperla.mx'
    },
    footer: 'Propuesta válida sujeta a disponibilidad al momento de la firma del contrato.'
  },

  en: {
    hero: {
      eyebrow: 'Wellness and balance in the heart of La Paz',
      headline: 'Group Proposal'
    },
    meta: {
      contactLabel: 'Contact', contact: 'Ximena Morales',
      companyLabel: 'Company / Group', company: 'DMC Meetings · Grupo Empresarial',
      datesLabel: 'Group dates', dates: 'Dec 01–03, 2026',
      dateLabel: 'Date', date: 'La Paz, BCS · Jul 15, 2026'
    },
    intro: 'We are delighted that you have considered Hotel Perla La Paz, Tapestry Collection by Hilton, for your group\'s stay. An iconic Art Deco lifestyle and boutique hotel located in the heart of La Paz, Baja California Sur, with stunning views of the Sea of Cortez —described by Jacques Cousteau as "the aquarium of the world." With 90 rooms and suites, we blend historic charm with modern comfort, just 20 minutes from La Paz International Airport.',
    tapHint: 'Tap a section to view details',
    rates: {
      enabled: true,
      title: 'Rates &amp; Terms',
      checkInLabel: 'Check-in', checkIn: 'December 1, 2026',
      checkOutLabel: 'Check-out', checkOut: 'December 3, 2026',
      tableHeaders: { category: 'Category', col1: 'Dec 1', col2: 'Dec 2', totalRooms: 'Total rms.', rate: 'Rate', subtotal: 'Subtotal' },
      rows: [
        { category: 'Double Room', day1: '10', day2: '10', totalRooms: '20', rate: '$4,500.00', subtotal: '$5,707.12' }
      ],
      footnote: 'Departure on December 3. Includes taxes ($900.00), environmental fee ($82.12) and service charge ($225.00) per room/night. Rates in Mexican pesos (MXN).',
      grandTotalLabel: 'Grand total lodging',
      grandTotalSub: '20 rooms · 2 nights',
      grandTotalAmount: '$114,142.40',
      grandTotalCurrency: 'MXN',
      concessionsLabel: 'Group concessions',
      concessions: [
        'Welcome drink upon check-in',
        'Daily reveal: morning coffee, tea and sweet bread',
        'Access to daily Perla Lifestyle Calendar activities, subject to availability',
        'Complimentary Wi-Fi throughout the stay',
        'Extended group rate 2 days before and after official dates, subject to availability',
        'Complimentary parking services',
        'Hilton Honors: 1 point per dollar spent, applicable to rooms only',
        'Room rate commissionable at 10% before taxes'
      ]
    },
    agenda: {
      enabled: true,
      title: 'Estimated Agenda',
      intro: 'Commercial proposal for food, beverage and transportation for the group. Rates in Mexican pesos (MXN).',
      items: [
        { visible: true, event: 'Round-trip Airport / Hotel Transportation', day: 'TBD', time: 'TBD', place: 'Airport - Hotel', pax: '20', total: '$5,200.00', description: 'Round-trip Sprinter van transfer for 20 people and 15 suitcases. Exempt from taxes for local transfers; billed at 0% VAT.' },
        { visible: true, event: 'Executive Menu · Day 1', day: 'Day 1', time: 'TBD', place: 'Terraza Restaurant', pax: '20', total: '$39,300.00', description: 'American breakfast, 2-course midday menu, 3-course Perla Special dinner menu.' },
        { visible: true, event: 'Coffee Break', day: 'TBD', time: '6 hours', place: 'El Mechudo Room', pax: '20', total: '$9,600.00', description: 'Basic continuous coffee break for 6 hours, 20 people.' },
        { visible: true, event: 'Executive Menu · Day 2', day: 'Day 2', time: 'TBD', place: 'Terraza Restaurant', pax: '20', total: '$39,300.00', description: 'American breakfast, 2-course midday menu, 3-course Perla Special dinner menu.' },
        { visible: true, event: 'Year-end Dinner', day: 'TBD', time: '4 hours', place: 'Madre Perla Terrace', pax: '20', total: '$38,706.40', description: 'National open bar (Margarita, Paloma, Charro Negro, Michelada, Tequila Centenario Blanco, Torres Brandy, Bacardí White Rum, Smirnoff Vodka, Johnny Walker Red Label Whisky). Includes special banquet setup: round table, crossback chair, linens, napkins, glass and base plate.' }
      ],
      totalLabel: 'Estimated agenda total',
      totalAmount: '$132,106.40',
      totalCurrency: 'MXN'
    },
    rooms: {
      enabled: true,
      title: 'Rooms',
      intro: '90 rooms designed to deliver comfort, sophistication and an authentic connection to the destination, available in single, double, Jr. Suite and Master Suite categories.',
      types: [
        { visible: true, imageKey: 'roomDouble', alt: '2 double beds', title: '2 Double Beds (38 rooms)', size: '25.08 m² / 270 sq ft' },
        { visible: true, imageKey: 'roomKing', alt: '1 king bed with terrace', title: '1 King Bed with Terrace (48 rooms)', size: '30.93 m² / 333 sq ft · private terrace' }
      ],
      amenitiesLabel: 'In every room',
      amenities: [
        'Private balcony or terrace', 'Air conditioning', 'Safe box with laptop capacity', 'Nespresso coffee maker',
        'Courtesy minibar', 'Ironing kit', 'Hair dryer', 'Illuminated vanity mirror',
        'Rain shower', 'Exclusive bath amenities', 'Sandals and beach bag', 'Wireless internet'
      ]
    },
    amenities: {
      enabled: true,
      title: 'Amenities &amp; Experiences',
      hotelAmenitiesLabel: 'Hotel amenities',
      hotelAmenities: [
        'Rooftop pool', 'Room service', 'Business center', 'Restaurant',
        'Laundry service', 'Event space', 'Fitness center and yoga', 'Accessible rooms'
      ],
      activitiesLabel: 'Signature Perla activities',
      activityGroups: [
        { title: 'Low impact', items: ['Yoga: Vinyasa, Hatha, Kundalini', 'Meditation + Energy activation'] },
        { title: 'High impact', items: ['Towel workout', 'Boot Camp', 'Jogging'] },
        { title: 'Tours', items: ['Historic Downtown walk', 'Instagram / bike tour', 'Espíritu Santo Island and Balandra'] },
        { title: 'Gastronomy', items: ['Origin-paired coffee tasting', 'Ceviche class', 'Wine tasting', 'Mezcal shot class', 'Poolside pampering', 'Sunset cocktail'] }
      ],
      tourCaption: 'Tours and experiences across the Sea of Cortez'
    },
    venues: {
      enabled: true,
      title: 'Event Spaces',
      intro: 'Five versatile spaces for meetings, presentations and social events, with setups available upon request.',
      list: [
        { name: 'Madre Perla', size: '112.3 m² / 1,208 sq ft' },
        { name: 'Mechudo Meeting Room', size: '95.95 m² / 1,033 sq ft' },
        { name: 'Interior Courtyard', size: '318 m² / 3,423 sq ft' },
        { name: 'Main Restaurant', size: '213.10 m² / 2,294 sq ft' },
        { name: 'La Terraza Café', size: '145.36 m² / 1,564 sq ft' }
      ]
    },
    policies: {
      enabled: true,
      title: 'Hotel Policies',
      quickFacts: [
        { label: 'Check-in', value: '3:00 PM' },
        { label: 'Check-out', value: '12:00 PM' },
        { label: 'Minors', value: '17 or under' },
        { label: 'Pets', value: 'Welcome' }
      ],
      blocks: [
        { title: 'Rate specification', text: 'Rates per room per night in Mexican pesos (MXN), single or double occupancy, European plan (does not include meals). Subject to 20% tax, 5% service charge and Environmental Sanitation fee. Taxes are set by the Government and may change without notice; the 5% service charge was negotiated by the local union and cannot be waived or negotiated.' },
        { title: 'Payment policy', text: '30% of the total amount upon signing the contract. 50% of the total 45 days before arrival. 20% of the total 15 days before arrival.' },
        { title: 'Cancellation policy', text: 'The initial deposit will be forfeited in the event of group cancellation at any time. Cancellations within 30 days of arrival will incur 100% of the contracted amount, including taxes and service charges.' },
        { title: 'No-show policy', text: 'No-shows, early departures or unused nights will not be refunded; the full stay will be charged. All accounts must be settled before departure, in cash or by credit/debit card.' }
      ]
    },
    contact: {
      enabled: true,
      title: 'Contact',
      hotelName: 'Hotel Perla La Paz, Tapestry Collection by Hilton',
      addressLine1: 'Paseo Álvaro Obregón 1570, Zona Central',
      addressLine2: '23000 La Paz, B.C.S., Mexico',
      contactName: 'Cecilia Ruvalcaba',
      contactTitle: 'Sales Executive',
      contactEmail: 'sales.executive@hotelperla.mx'
    },
    footer: 'Proposal valid subject to availability at the time of contract signing.'
  }
};
