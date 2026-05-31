import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_decorations(self, page_count):
        self.saveState()
        
        # Primary Color accents (Orange and Dark Zinc)
        orange = colors.HexColor("#ea580c")
        dark_zinc = colors.HexColor("#18181b")
        zinc_gray = colors.HexColor("#71717a")
        light_border = colors.HexColor("#e4e4e7")
        
        # Header (Only on pages > 1)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(dark_zinc)
            self.drawString(54, 755, "PROPUESTA COMERCIAL: PLATAFORMA DE INSCRIPCIONES")
            self.setFont("Helvetica", 8)
            self.setFillColor(zinc_gray)
            self.drawRightString(558, 755, "XCO SIN LÍMITES")
            self.setStrokeColor(light_border)
            self.setLineWidth(0.5)
            self.line(54, 747, 558, 747)
            
        # Footer (On all pages)
        self.setStrokeColor(light_border)
        self.setLineWidth(0.5)
        self.line(54, 52, 558, 52)
        
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(orange)
        self.drawString(54, 38, "ROMERO LABS")
        self.setFont("Helvetica", 8)
        self.setFillColor(zinc_gray)
        self.drawString(130, 38, "|  Software de Alto Rendimiento y Accesibilidad")
        
        page_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(558, 38, page_text)
        
        self.restoreState()

def create_proposal_pdf(filename="Propuesta_Inscripciones_XCO.pdf"):
    # Target 0.75 in margins (54 points)
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=72,
        bottomMargin=72
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles to fit the beautiful sporty brand
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=32,
        leading=38,
        textColor=colors.HexColor("#18181b"),
        spaceAfter=10
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=16,
        leading=22,
        textColor=colors.HexColor("#ea580c"),
        spaceAfter=30
    )
    
    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#18181b"),
        spaceBefore=15,
        spaceAfter=10,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Header2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#ea580c"),
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=15,
        textColor=colors.HexColor("#27272a"),
        spaceAfter=10
    )
    
    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=20,
        firstLineIndent=-10,
        spaceAfter=6
    )
    
    table_text = ParagraphStyle(
        'TableText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#27272a")
    )
    
    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=colors.white
    )

    story = []
    
    # ---------------- COVER PAGE ----------------
    story.append(Spacer(1, 1.2 * inch))
    
    # Orange accent bar
    d_orange = Table([[""]], colWidths=[60], rowHeights=[6])
    d_orange.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#ea580c")),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(d_orange)
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("PROPUESTA COMERCIAL", title_style))
    story.append(Paragraph("Plataforma Integral de Inscripciones & Acreditaciones<br/>Campeonato 'XCO Sin Límites' y Calendario 2027", subtitle_style))
    
    story.append(Spacer(1, 2 * inch))
    
    # Metadata block
    meta_text = """
    <b>Preparado para:</b> Organizador de Competencias Deportivas (Córdoba, Argentina)<br/>
    <b>Presentado por:</b> Romero Labs (Desarrollo Frontend & Accesibilidad)<br/>
    <b>Fecha:</b> Mayo de 2026<br/>
    <b>Validez del Presupuesto:</b> 30 días corridos
    """
    story.append(Paragraph(meta_text, body_style))
    story.append(PageBreak())
    
    # ---------------- PAGE 2: VALOR & INTRO ----------------
    story.append(Paragraph("1. Resumen Ejecutivo y Propuesta de Valor", h1_style))
    story.append(Paragraph(
        "El éxito de una competencia deportiva de Mountain Bike de alto rendimiento no sólo se mide en la pista, "
        "sino también en la comodidad y la seguridad del competidor desde el primer contacto digital. Diseñamos un "
        "asistente de inscripción (Wizard) interactivo de 3 etapas enfocado en eliminar la fricción técnica, "
        "garantizando un proceso veloz, estricto y adaptado al ecosistema local de Córdoba.", body_style))
    
    story.append(Paragraph("Pilares Clave de la Plataforma:", h2_style))
    
    story.append(Paragraph("• <b>Máxima Accesibilidad (Enfoque Senior/Master):</b> La presencia de corredores Master (+65 años) "
                           "exige una interfaz adaptada. El sistema implementa fuentes ampliadas, botones de tamaño extra grande (h-16), "
                           "máximo contraste cromático que cumple las pautas WCAG y soporte de accesibilidad optimizado para facilitar la lectura.", bullet_style))
    
    story.append(Paragraph("• <b>Lógica Avanzada de Categorías (Reglamento MTB):</b> El sistema calcula en tiempo real la edad exacta "
                           "que el competidor tendrá al 31 de diciembre del año en curso, sugiriendo la categoría correspondiente de forma automatizada "
                           "para evitar inscripciones erróneas y simplificar el control deportivo.", bullet_style))
                           
    story.append(Paragraph("• <b>Control Sanitario y Legal Obligatorio:</b> Se integra la declaración de grupo sanguíneo, registro de "
                           "alergias o medicación crónica y un deslinde de responsabilidad legal de gran visibilidad y aceptación forzosa para blindar "
                           "legalmente a la organización del evento.", bullet_style))
                           
    story.append(Paragraph("• <b>Módulo de Pago Dinámico Adaptado a Argentina:</b> Integración simulada de pasarela express (Mercado Pago) "
                           "con acreditación inmediata y un sistema robusto para Transferencia Bancaria con copiado rápido de alias y carga interactiva "
                           "del comprobante de pago.", bullet_style))

    story.append(Spacer(1, 15))
    
    # ---------------- PAGE 3: PLANES FINANCIEROS ----------------
    story.append(Paragraph("2. Alternativas Financieras para el Lanzamiento", h1_style))
    story.append(Paragraph(
        "Para el desarrollo de la primera competencia y las 8 carreras proyectadas para el próximo año, "
        "ofrecemos dos esquemas de contratación flexibles. La Opción B representa la alternativa de menor riesgo inicial "
        "ya que traslada el costo del software de forma transparente a la tasa de inscripción abonada por el corredor.", body_style))
    
    # PLAN A CARD / BLOCK
    story.append(Paragraph("Opción A: Modelo de Compra Integral + Soporte", h2_style))
    story.append(Paragraph(
        "Bajo esta modalidad, la organización adquiere la propiedad del sistema. Se abona un valor de desarrollo inicial "
        "fuerte y posteriormente tarifas sumamente bajas por clonación y asistencia en las siguientes fechas.", body_style))
    
    plan_a_data = [
        [Paragraph("<b>Concepto</b>", table_header), Paragraph("<b>Descripción / Detalle</b>", table_header), Paragraph("<b>Costo (ARS)</b>", table_header)],
        [Paragraph("<b>Desarrollo Inicial (Carrera 1)</b>", table_text), Paragraph("Desarrollo a medida de la plataforma interactiva, base de datos, maquetación, integraciones y puesta a punto.", table_text), Paragraph("<b>$2.200.000</b>", table_text)],
        [Paragraph("<b>Réplica y Soporte (Carreras 2 a 9)</b>", table_text), Paragraph("Duplicación del sistema, reemplazo de marca gráfica (pista, afiche, categorías) y soporte en el día del evento.", table_text), Paragraph("<b>$500.000</b><br/>por carrera", table_text)]
    ]
    
    t_plan_a = Table(plan_a_data, colWidths=[1.8*inch, 3.2*inch, 1.5*inch])
    t_plan_a.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#18181b")),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f4f4f5")]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e4e4e7")),
    ]))
    story.append(t_plan_a)
    story.append(Spacer(1, 20))

    # PLAN B CARD / BLOCK
    story.append(Paragraph("Opción B: Modelo Híbrido (Costo de Setup + Tarifa por Corredor)", h2_style))
    story.append(Paragraph(
        "Es el modelo más adoptado a nivel nacional. La organización absorbe un costo inicial mínimo de setup técnico, "
        "y el mantenimiento del software se amortiza cobrando un costo de servicio fijo por cada participante inscrito (sumado a la inscripción).", body_style))
    
    plan_b_data = [
        [Paragraph("<b>Concepto</b>", table_header), Paragraph("<b>Descripción / Detalle</b>", table_header), Paragraph("<b>Costo (ARS)</b>", table_header)],
        [Paragraph("<b>Setup Inicial Único (Temporada)</b>", table_text), Paragraph("Configuración inicial del servidor, despliegue del framework de base y alta del dominio oficial por 12 meses.", table_text), Paragraph("<b>$650.000</b>", table_text)],
        [Paragraph("<b>Costo por Corredor Acreditado</b>", table_text), Paragraph("Tarifa fija de servicio por cada competidor que complete su pre-inscripción en la plataforma (se suma al costo de inscripción).", table_text), Paragraph("<b>$1.000</b><br/>por corredor", table_text)]
    ]
    
    t_plan_b = Table(plan_b_data, colWidths=[1.8*inch, 3.2*inch, 1.5*inch])
    t_plan_b.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#ea580c")),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f4f4f5")]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e4e4e7")),
    ]))
    story.append(t_plan_b)
    
    story.append(PageBreak())

    # ---------------- PAGE 4: COMPARATIVA Y CONDICIONES ----------------
    story.append(Paragraph("3. Análisis Comparativo e Impacto", h1_style))
    story.append(Paragraph(
        "Ambos planes buscan maximizar la recaudación y la organización del evento. La siguiente tabla simula "
        "el costo financiero para un circuito de 9 carreras anuales con un promedio estimado de 350 corredores por evento:", body_style))
    
    comp_data = [
        [Paragraph("<b>Métrica de Comparación</b>", table_header), Paragraph("<b>Opción A (Desarrollo Fijo)</b>", table_header), Paragraph("<b>Opción B (Por Corredor)</b>", table_header)],
        [Paragraph("<b>Inversión Inicial (Carrera 1)</b>", table_text), Paragraph("<b>$2.200.000 ARS</b>", table_text), Paragraph("<b>$650.000 ARS</b>", table_text)],
        [Paragraph("<b>Costo por Carrera Adicional</b>", table_text), Paragraph("$500.000 ARS", table_text), Paragraph("$0 ARS (Costo trasladado al corredor)", table_text)],
        [Paragraph("<b>Desembolso Total Neto del Organizador</b>", table_text), Paragraph("<b>$6.200.000 ARS</b>", table_text), Paragraph("<b>$650.000 ARS</b>", table_text)],
        [Paragraph("<b>Costo de Software por Corredor</b>", table_text), Paragraph("Amortizado internamente (~$1.900 ARS)", table_text), Paragraph("$1.000 ARS (Cobrado directamente al corredor)", table_text)],
        [Paragraph("<b>Recomendación Romero Labs</b>", table_text), Paragraph("Ideal si el organizador cuenta con patrocinadores fuertes para financiar el software.", table_text), Paragraph("<b>Altamente Recomendado.</b> Cero riesgo financiero y costo nulo para el organizador.", table_text)]
    ]
    
    t_comp = Table(comp_data, colWidths=[2.2*inch, 2.15*inch, 2.15*inch])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#18181b")),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f4f4f5")]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e4e4e7")),
    ]))
    story.append(t_comp)
    
    story.append(Spacer(1, 25))
    
    # CONDITIONS BLOCK
    story.append(Paragraph("4. Términos y Condiciones Comerciales", h1_style))
    story.append(Paragraph("• <b>Propiedad Intelectual:</b> En la Opción A, el código y la base de datos se transfieren al organizador una vez cancelado el pago final. En la Opción B, el sistema se provee bajo licencia SaaS (Software como Servicio).", bullet_style))
    story.append(Paragraph("• <b>Hosting y Mantenimiento:</b> Ambos planes incluyen el costo de alojamiento en servidores de alta disponibilidad y soporte técnico básico durante el primer año de contrato.", bullet_style))
    story.append(Paragraph("• <b>Soporte el Día del Evento:</b> Se garantiza asistencia técnica telefónica y remota prioritaria durante las 6 horas previas al inicio de la carrera para resolver cualquier incidencia con las planillas de los corredores.", bullet_style))
    story.append(Paragraph("• <b>Forma de Pago:</b> Para la Opción A, se requiere un 50% de anticipo para el inicio de los trabajos y un 50% contra entrega conforme y testeo de la plataforma. Para la Opción B, se abona el 100% del setup para el despliegue inicial.", bullet_style))
    
    story.append(Spacer(1, 30))
    
    # Firmas
    firma_data = [
        [Paragraph("____________________________<br/><b>Romero Labs</b><br/>Desarrollo & UX", table_text), 
         Paragraph("____________________________<br/><b>Organizador del Campeonato</b><br/>Director de Evento", table_text)]
    ]
    t_firmas = Table(firma_data, colWidths=[3.25*inch, 3.25*inch])
    t_firmas.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_firmas)

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)

if __name__ == "__main__":
    create_proposal_pdf()
    print("PDF Propuesta generado de forma exitosa.")
