import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { TimeLineSvc, YearsPeriod } from './timeline.service';

@Component({
  selector: 'app-timeline',
  providers: [TimeLineSvc],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimeLineComponent implements OnInit, AfterViewInit {
  constructor(private timeLineSvc: TimeLineSvc) {}

  // Chart dimensions
  canvasWidth = 960; // Increased width
  canvasHeight = 280;
  chartLoaded = false;
  activeHandle: 'left' | 'right' | null = null;
  initialRightYearIndex: number = -1;

  savedLeftIndex: number = -1; 
savedRightIndex: number = -1;
  // Canvas reference
  @ViewChild('timelineCanvas') canvasRef?: ElementRef<HTMLCanvasElement>;

  // Data properties
  dataSource: any[] = [];
  queryUrlYears!: string;
  currentYear: string = (new Date().getFullYear()).toString();
  
  // UI state
  accessibleMode: boolean = false;
  accessibleError: boolean = true;
  isLoading: boolean = true;
  
  // Selected values
  firstYearSelected: string = '';
  lastYearSelected: string = '';
  
  // Chart elements
  chartContext: any;
  chart: any;
  slider: any = {
    leftHandle: { x: 0, dragging: false },
    rightHandle: { x: 0, dragging: false },
    track: { width: 0 }
  };

  // Input/Output
  @Input() yearsSelected: any;
  @Input() yearsURL: string = ``;
  @Output() valueChanged = new EventEmitter<any>();
  @Output() rangeString  = new EventEmitter<string>();

  ngOnInit(): void {
    this.getData(this.yearsSelected);

    this.queryUrlYears = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+eli%3A+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%23%3E%0D%0APREFIX+dct%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0D%0A%0D%0Aselect+%3Fyear+%28count%28distinct+%3Fitem%29+as+%3Fcount%29+where+%7B%0D%0A++++%7B%0D%0A++++++++select+distinct+%3Fitem+xsd%3Aint%28substr%28str%28%3Fbegin%29%2C+1%2C+4%29%29+as+%3Fyear+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++++++++++++%3Fitem+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%3B%0D%0A++++++++++++++++++dct%3Atemporal+%3Fx1.%0D%0A++++++++++++%3Fx1+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInterval%3E+%3Fx2.%0D%0A++++++++++++OPTIONAL+%7B%0D%0A++++++++++++++++%3Fx2+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimehasBeginning%3E+%3Fx3.%0D%0A++++++++++++++++%3Fx3+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInstant%3E+%3Fx4.%0D%0A++++++++++++++++%3Fx4+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeinXSDDate%3E+%3Fbegin.%0D%0A++++++++++++++++FILTER%28%21regex%28%3Fbegin%2C+%22Curso%22%29%29.%0D%0A++++++++++++++++FILTER%28%21regex%28%3Fbegin%2C+%22+de+%22%29%29.%0D%0A++++++++++++++++FILTER%28%21regex%28%3Fbegin%2C+%22+actual%22%29%29.%0D%0A++++++++++++++++FILTER%28%21regex%28%3Fbegin%2C+%22Temporada%22%29%29.%0D%0A++++++++++++++++FILTER%28%21regex%28%3Fbegin%2C+%22+Trim%22%29%29.%0D%0A++++++++++++++++FILTER%28%21regex%28%3Fbegin%2C+%22%2F%22%29%29.%0D%0A++++++++++++++++FILTER%28%3Fbegin%21%3D%22*%22%5E%5E%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23date%3E%29.%0D%0A++++++++++++%7D%0D%0A++++++++++++FILTER+%28%21BOUND%28%3Fbegin%29+%7C%7C+%28xsd%3Aint%28substr%28str%28%3Fbegin%29%2C+1%2C+4%29%29+%3E%3D+1978+%26%26+xsd%3Aint%28substr%28str%28%3Fbegin%29%2C+1%2C+4%29%29+%3C%3D+${new Date().getFullYear()}%29%29.%0D%0A++++++++%7D%0D%0A++++%7D+union+%7B%0D%0A++++++++select+distinct+%3Fitem+xsd%3Aint%28substr%28%3Fo%2C+1%2C+4%29%29+as+%3Fyear+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++++++++++++%3Fitem+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%2Fdate_publication%3E+%3Fo%3B%0D%0A++++++++++++++++++a+%3Chttp%3A%2F%2Fschema.org%2FCreativeWork%3E%3B%0D%0A++++++++++++++++++dc%3Asource+%3Fvista.%0D%0A++++++++++++values+%3Fvista+%7B+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2Fb24502b9-6eea-4ac3-8cda-5d818008a6f5%2Fresource%2Fc46837eb-1093-40e1-9b3c-5f316e6a4f09%3E%0D%0A++++++++++++++++++++++++++++%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2Faad6f487-fd9c-4339-9cae-f97f98b461ac%2Fresource%2F266cda84-1f2f-4971-8e60-1aa96bf31fb4%3E%0D%0A++++++++++++++++++++++++++++%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F46f113d7-9e72-437d-b5ad-5acb8cc00683%2Fresource%2Fb1eed8fd-2a89-4073-b2f0-dd6e07e214ee%3E%7D.%0D%0A++++++++++++FILTER+%28xsd%3Aint%28substr%28%3Fo%2C+1%2C+4%29%29+%3E%3D+1978+%26%26+xsd%3Aint%28substr%28%3Fo%2C+1%2C+4%29%29+%3C%3D+${new Date().getFullYear()}%29.%0D%0A++++++++%7D%0D%0A++++%7D+union+%7B%0D%0A++++++++select+distinct+%3Fitem+xsd%3Aint%28substr%28%3Fo%2C+1%2C+4%29%29+as+%3Fyear+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++++++++++++%3Fitem+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%2Fdate_publication%3E+%3Fo.%0D%0A++++++++++++%3Fitem+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23wasUsedBy%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fprocedencia%2F84717AFC-5D08-7925-1181-FAE3DB3049F7%3E.%0D%0A++++++++++++FILTER+%28xsd%3Aint%28substr%28%3Fo%2C+1%2C+4%29%29+%3E%3D+1978+%26%26+xsd%3Aint%28substr%28%3Fo%2C+1%2C+4%29%29+%3C%3D+${new Date().getFullYear()}%29.%0D%0A++++++++%7D%0D%0A++++%7D+union+%7B%0D%0A++++++++select+distinct+%3Fitem3+as+%3Fitem+xsd%3Aint%28substr%28%3Fo%2C+1%2C+4%29%29+as+%3Fyear+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++++++++++++%3Fitem+eli%3Adate_publication+%3Fo.%0D%0A++++++++++++%3Fitem+eli%3Ais_realized_by+%3Fitem2.%0D%0A++++++++++++%3Fitem2+eli%3Ais_embodied_by+%3Fitem3.%0D%0A++++++++++++FILTER+%28%3Fo+%3E%3D+%221978-01-01TZ%22%5E%5Exsd%3AdateTime+%26%26+xsd%3Aint%28substr%28%3Fo%2C+1%2C+4%29%29+%3C%3D+${new Date().getFullYear()}%29.%0D%0A++++++++%7D%0D%0A++++%7D+union+%7B%0D%0A++++++++select+distinct+%3Fdsd+as+%3Fitem+xsd%3Aint%28%3Fyear%29+as+%3Fyear+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++++++++++++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A++++++++++++%3Fdataset+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23structure%3E+%3Fdsd.%0D%0A++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A++++++++++++%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A++++++++++++FILTER+%28xsd%3Aint%28%3Fyear%29+%3E%3D+1978+%26%26+xsd%3Aint%28%3Fyear%29+%3C%3D+2024%29.%0D%0A++++++++%7D%0D%0A++++%7D%0D%0A%7D%0D%0Agroup+by+%3Fyear%0D%0Aorder+by+%3Fyear%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    this.timeLineSvc.getAllYears(this.queryUrlYears).subscribe((data) => {
      const years = data?.results.bindings;
      const filteredYears = years.filter(
        (element: any) => element.year && element.year.value
      );

      const firstYear = filteredYears.find(
        (element: any) => element?.year.value == '1978'
      );
      const lastYear = filteredYears.find(
        (element: any) => element?.year.value == this.currentYear
      );
      const filteredData = filteredYears.slice(
        filteredYears.indexOf(firstYear)
      );

      filteredData.forEach((element: any, index: any) => {
        this.dataSource[index] = {
          date: element.year.value,
          dataQuantity: Number(element['count'].value),
        };
      });

      this.firstYearSelected = this.yearsSelected ? this.yearsSelected[0] : this.dataSource[0]?.date;
      this.lastYearSelected = this.yearsSelected ? this.yearsSelected[1] : 
        this.dataSource[this.dataSource.length - 1]?.date;

      this.updateRangeSelector();
      this.isLoading = false;

        setTimeout(() => this.initChart(), 0);

    });
  }

  ngAfterViewInit(): void {
    // Wait for canvas to be available
    setTimeout(() => {
      this.initChart();
    }, 300);
  }

  initChart() {
    const canvas = this.canvasRef?.nativeElement || document.getElementById('timeline-chart') as HTMLCanvasElement;
    if (!canvas) return;
    
    this.chartContext = canvas.getContext('2d');
    
    // Draw the chart and setup slider
    this.drawChart();
    this.setupSliderHandlers(canvas);
    this.chartLoaded = true;
  }

  drawChart() {
    if (!this.chartContext || !this.dataSource.length) return;
    
    const ctx = this.chartContext;
    const width = this.canvasWidth;
    const height = this.canvasHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Chart area dimensions
    const chartTop = 50;
    const chartBottom = height - 50;
    const chartHeight = chartBottom - chartTop;
    const chartLeft = 50;
    const chartRight = width - 50;
    const chartWidth = chartRight - chartLeft;
    
    // Find max value for scaling
    const maxValue = Math.max(...this.dataSource.map(item => item.dataQuantity));
    
    // Calculate bar width and spacing
    const barWidth = chartWidth / this.dataSource.length * 0.7; // Slightly narrower bars
    const barSpacing = chartWidth / this.dataSource.length * 0.3; // More spacing
    
    // Draw background
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(0, 0, width, height);
    
    // Draw title
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('Selecciona un rango de años', width / 2, 25);
    
    // Draw axes
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartLeft, chartBottom);
    ctx.lineTo(chartRight, chartBottom);
    ctx.stroke();
    
    // Draw data bars
    this.dataSource.forEach((item, index) => {
      const x = chartLeft + (chartWidth / this.dataSource.length) * index;
      const barHeight = (item.dataQuantity / maxValue) * chartHeight * 0.9; // Slightly shorter bars
      const y = chartBottom - barHeight;
      
      // Draw bar
      ctx.fillStyle = '#00607A';
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw year labels for some years (not all to avoid clutter)
      if (index % Math.ceil(this.dataSource.length / 15) === 0) {
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.date, x + barWidth / 2, chartBottom + 20);
      }
    });
    
    // Setup slider track
    this.slider.track.width = chartWidth;
    
    // Si los índices guardados no están inicializados, inicialízalos ahora
    if (this.savedLeftIndex === -1 || this.savedRightIndex === -1) {
      const firstYearIndex = this.dataSource.findIndex(d => d.date === this.firstYearSelected);
      const lastYearIndex = this.dataSource.findIndex(d => d.date === this.lastYearSelected);
      
      this.savedLeftIndex = firstYearIndex !== -1 ? firstYearIndex : 0;
      this.savedRightIndex = lastYearIndex !== -1 ? lastYearIndex : this.dataSource.length - 1;
    }
    
    // Usar los índices guardados para posicionar los handles
    const leftX = chartLeft + (chartWidth / (this.dataSource.length - 1)) * this.savedLeftIndex;
    const rightX = chartLeft + (chartWidth / (this.dataSource.length - 1)) * this.savedRightIndex;
    
    this.slider.leftHandle.x = leftX;
    this.slider.rightHandle.x = rightX;
    
    // Draw selected range highlight
    ctx.fillStyle = 'rgba(0, 96, 122, 0.2)';
    ctx.fillRect(leftX, chartTop, rightX - leftX, chartHeight);
    
    // Draw slider handles
    this.drawSliderHandle(leftX, chartBottom);
    this.drawSliderHandle(rightX, chartBottom);
  }
  
  drawSliderHandle(x: number, y: number) {
    const ctx = this.chartContext;
    if (!ctx) return;
    
    // Draw handle
    ctx.fillStyle = '#00607A';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw grip lines
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 3);
    ctx.lineTo(x + 4, y - 3);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x - 4, y);
    ctx.lineTo(x + 4, y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 3);
    ctx.lineTo(x + 4, y + 3);
    ctx.stroke();
  }

  // Nuevas variables para mantener registro exacto del estado de ambos handles


// Reemplazar el setupSliderHandlers
setupSliderHandlers(canvas: HTMLCanvasElement) {
  if (!canvas) return;
  
  const chartBottom = this.canvasHeight - 50;
  
  // Check if point is near handle
  const isNearHandle = (x: number, y: number, handleX: number) => {
    return Math.sqrt(Math.pow(x - handleX, 2) + Math.pow(y - chartBottom, 2)) <= 15;
  };
  
  // Mouse events
  const handleMouseDown = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Inicializar los índices guardados si aún no se han establecido
    if (this.savedLeftIndex === -1 || this.savedRightIndex === -1) {
      const chartLeft = 50;
      const chartWidth = this.canvasWidth - 100;
      
      // Guardar las posiciones actuales de ambos handles
      const leftPos = (this.slider.leftHandle.x - chartLeft) / chartWidth;
      const rightPos = (this.slider.rightHandle.x - chartLeft) / chartWidth;
      
      this.savedLeftIndex = Math.max(0, Math.min(this.dataSource.length - 1, 
        Math.round(leftPos * (this.dataSource.length - 1))));
      this.savedRightIndex = Math.max(0, Math.min(this.dataSource.length - 1, 
        Math.round(rightPos * (this.dataSource.length - 1))));
    }
    
    if (isNearHandle(x, y, this.slider.leftHandle.x)) {
      this.activeHandle = 'left';
    } else if (isNearHandle(x, y, this.slider.rightHandle.x)) {
      this.activeHandle = 'right';
    }
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!this.activeHandle) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    const chartLeft = 50;
    const chartRight = this.canvasWidth - 50;
    const chartWidth = chartRight - chartLeft;
    
    // Constrain x to chart area
    const constX = Math.max(chartLeft, Math.min(chartRight, x));
    
    // Calcular el índice del año basado en la posición del mouse
    const pos = (constX - chartLeft) / chartWidth;
    const yearIndex = Math.round(pos * (this.dataSource.length - 1));
    
    if (this.activeHandle === 'left') {
      // No permitir que el handle izquierdo vaya más allá del handle derecho
      if (yearIndex < this.savedRightIndex) {
        this.savedLeftIndex = yearIndex;
        this.updateHandlePositions();
      }
    } else if (this.activeHandle === 'right') {
      // No permitir que el handle derecho vaya más allá del handle izquierdo
      if (yearIndex > this.savedLeftIndex) {
        this.savedRightIndex = yearIndex;
        this.updateHandlePositions();
      }
    }
  };
  
  const endDrag = () => {
    if (this.activeHandle) {
      this.activeHandle = null;
      this.emitValueChanged();
    }
  };
  
  // Touch events for mobile - similar logic
  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    
    // Inicializar los índices guardados si aún no se han establecido
    if (this.savedLeftIndex === -1 || this.savedRightIndex === -1) {
      const chartLeft = 50;
      const chartWidth = this.canvasWidth - 100;
      
      // Guardar las posiciones actuales de ambos handles
      const leftPos = (this.slider.leftHandle.x - chartLeft) / chartWidth;
      const rightPos = (this.slider.rightHandle.x - chartLeft) / chartWidth;
      
      this.savedLeftIndex = Math.max(0, Math.min(this.dataSource.length - 1, 
        Math.round(leftPos * (this.dataSource.length - 1))));
      this.savedRightIndex = Math.max(0, Math.min(this.dataSource.length - 1, 
        Math.round(rightPos * (this.dataSource.length - 1))));
    }
    
    if (isNearHandle(x, y, this.slider.leftHandle.x)) {
      this.activeHandle = 'left';
    } else if (isNearHandle(x, y, this.slider.rightHandle.x)) {
      this.activeHandle = 'right';
    }
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (!this.activeHandle) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    
    const chartLeft = 50;
    const chartRight = this.canvasWidth - 50;
    const chartWidth = chartRight - chartLeft;
    
    // Constrain x to chart area
    const constX = Math.max(chartLeft, Math.min(chartRight, x));
    
    // Calcular el índice del año basado en la posición del mouse
    const pos = (constX - chartLeft) / chartWidth;
    const yearIndex = Math.round(pos * (this.dataSource.length - 1));
    
    if (this.activeHandle === 'left') {
      // No permitir que el handle izquierdo vaya más allá del handle derecho
      if (yearIndex < this.savedRightIndex) {
        this.savedLeftIndex = yearIndex;
        this.updateHandlePositions();
      }
    } else if (this.activeHandle === 'right') {
      // No permitir que el handle derecho vaya más allá del handle izquierdo
      if (yearIndex > this.savedLeftIndex) {
        this.savedRightIndex = yearIndex;
        this.updateHandlePositions();
      }
    }
  };
  
  // Eliminar event listeners previos
  canvas.removeEventListener('mousedown', handleMouseDown);
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', endDrag);
  canvas.removeEventListener('touchstart', handleTouchStart);
  document.removeEventListener('touchmove', handleTouchMove);
  document.removeEventListener('touchend', endDrag);
  
  // Agregar nuevos event listeners
  canvas.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', endDrag);
  canvas.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchmove', handleTouchMove);
  document.addEventListener('touchend', endDrag);
}

// Nuevo método para actualizar la posición de ambos handles basado en los índices guardados
updateHandlePositions() {
  const chartLeft = 50;
  const chartWidth = this.canvasWidth - 100;
  
  // Verificar que los índices estén dentro del rango válido
  if (this.savedLeftIndex >= 0 && this.savedLeftIndex < this.dataSource.length &&
      this.savedRightIndex >= 0 && this.savedRightIndex < this.dataSource.length) {
      
    // Actualizar los años seleccionados basados en los índices guardados
    this.firstYearSelected = this.dataSource[this.savedLeftIndex].date;
    this.lastYearSelected = this.dataSource[this.savedRightIndex].date;
    
    // Actualizar la posición visual de los handles
    const barWidth = chartWidth / this.dataSource.length;
    
    this.slider.leftHandle.x = chartLeft + (this.savedLeftIndex / (this.dataSource.length - 1)) * chartWidth;
    this.slider.rightHandle.x = chartLeft + (this.savedRightIndex / (this.dataSource.length - 1)) * chartWidth;
    
    // Actualizar propiedades públicas
    this.yearsSelected = [this.firstYearSelected, this.lastYearSelected];
    this.yearsURL = `${this.firstYearSelected} - ${this.lastYearSelected}`;
    
    // Redibujar el gráfico
    this.drawChart();
  }
}


  updateLeftHandleYear() {
    if (!this.dataSource.length) return;
    
    const chartLeft = 50;
    const chartWidth = this.canvasWidth - 100;
    
    // Calcular solo el índice izquierdo basado en su posición actual
    const leftPos = (this.slider.leftHandle.x - chartLeft) / chartWidth;
    const leftIndex = Math.round(leftPos * (this.dataSource.length - 1));
    
    // Actualizar solo el primer año seleccionado
    if (leftIndex >= 0 && leftIndex < this.dataSource.length) {
      this.firstYearSelected = this.dataSource[leftIndex].date;
    }
    
    // Si tenemos un índice derecho guardado, mantenerlo
    if (this.initialRightYearIndex >= 0 && this.initialRightYearIndex < this.dataSource.length) {
      this.lastYearSelected = this.dataSource[this.initialRightYearIndex].date;
    }
    
    // Actualizar la posición del handle derecho según el año guardado
    // Esto mantiene el handle derecho en su posición original
    const rightIndex = this.initialRightYearIndex !== -1 ? 
      this.initialRightYearIndex : 
      this.dataSource.findIndex(d => d.date === this.lastYearSelected);
    
    if (rightIndex !== -1) {
      const rightPos = rightIndex / (this.dataSource.length - 1);
      this.slider.rightHandle.x = chartLeft + (chartWidth * rightPos);
    }
    
    // Actualizar propiedades públicas
    this.yearsSelected = [this.firstYearSelected, this.lastYearSelected];
    this.yearsURL = `${this.firstYearSelected} - ${this.lastYearSelected}`;
  }
  
  updateRightHandleYear() {
    if (!this.dataSource.length) return;
    
    const chartLeft = 50;
    const chartWidth = this.canvasWidth - 100;
    
    // Calcular solo el índice derecho basado en su posición actual
    const rightPos = (this.slider.rightHandle.x - chartLeft) / chartWidth;
    const rightIndex = Math.round(rightPos * (this.dataSource.length - 1));
    
    // Actualizar solo el último año seleccionado
    if (rightIndex >= 0 && rightIndex < this.dataSource.length) {
      this.lastYearSelected = this.dataSource[rightIndex].date;
    }
    
    // Actualizar propiedades públicas
    this.yearsSelected = [this.firstYearSelected, this.lastYearSelected];
    this.yearsURL = `${this.firstYearSelected} - ${this.lastYearSelected}`;
  }
  
  
  updateSelectedRangeFromHandles() {
    if (!this.dataSource.length) return;
    
    const chartLeft = 50;
    const chartWidth = this.canvasWidth - 100;
    
    // Calculate position as percentage of width
    const leftPos = (this.slider.leftHandle.x - chartLeft) / chartWidth;
    
    // Para el índice izquierdo, calculamos la posición proporcional
    const leftIndex = Math.round(leftPos * (this.dataSource.length - 1));
    
    // Para el índice derecho, mantenemos su valor actual si NO estamos arrastrando el handle izquierdo
    // Esto es la clave para evitar que el handle derecho salte a 2018 al mover el izquierdo
    const rightPos = (this.slider.rightHandle.x - chartLeft) / chartWidth;
    const rightIndex = Math.round(rightPos * (this.dataSource.length - 1));
    
    // Get years from data (with safety checks)
    if (leftIndex >= 0 && leftIndex < this.dataSource.length) {
      this.firstYearSelected = this.dataSource[leftIndex].date;
    }
    
    if (rightIndex >= 0 && rightIndex < this.dataSource.length) {
      this.lastYearSelected = this.dataSource[rightIndex].date;
    }
    
    // Update public properties
    this.yearsSelected = [this.firstYearSelected, this.lastYearSelected];
    this.yearsURL = `${this.firstYearSelected} - ${this.lastYearSelected}`;
  }

  emitValueChanged() {
    this.valueChanged.emit({
      value: this.yearsSelected
    });
    this.rangeString.emit(`${this.firstYearSelected}-${this.lastYearSelected}`);
  }

  accessibleSelect() {
    const firstYearIndex = this.dataSource.findIndex(
      (data) => data.date == this.firstYearSelected
    );
    const lastYearIndex = this.dataSource.findIndex(
      (data) => data.date == this.lastYearSelected
    );

    if (firstYearIndex > lastYearIndex) {
      this.accessibleError = true;
    } else {
      this.accessibleError = false;
      this.yearsSelected = this.dataSource
        .slice(firstYearIndex, lastYearIndex + 1)
        .map((data) => data.date);
      this.yearsURL = `${this.firstYearSelected} - ${this.lastYearSelected}`;
      
      // Update chart if it's been initialized
      if (this.chartLoaded) {
        // Update handles position
        const chartLeft = 50;
        const chartWidth = this.canvasWidth - 100;
        const barWidth = chartWidth / this.dataSource.length;
        
        this.slider.leftHandle.x = chartLeft + firstYearIndex * barWidth + barWidth/2;
        this.slider.rightHandle.x = chartLeft + lastYearIndex * barWidth + barWidth/2;
        
        this.drawChart();
      }
      
      this.emitValueChanged();
    }
  }

  updateRangeSelector() {
    this.yearsSelected = [this.firstYearSelected, this.lastYearSelected];
  }

  toggleAccessibleMode() {
    this.accessibleMode = !this.accessibleMode;
    
    if (!this.accessibleMode) {
      this.updateRangeSelector();
      // When going back to graphic mode, reinitialize the canvas
      setTimeout(() => {
        this.reinitializeChart();
      }, 100);
    }
  }

  reinitializeChart() {
    const canvas = this.canvasRef?.nativeElement || document.getElementById('timeline-chart') as HTMLCanvasElement;
    if (!canvas) return;
    
    // Actualizar los índices guardados basados en los años actuales antes de reinicializar
    this.savedLeftIndex = this.dataSource.findIndex(d => d.date === this.firstYearSelected);
    this.savedRightIndex = this.dataSource.findIndex(d => d.date === this.lastYearSelected);
    
    // Asegurarse de que los índices son válidos
    if (this.savedLeftIndex === -1) this.savedLeftIndex = 0;
    if (this.savedRightIndex === -1) this.savedRightIndex = this.dataSource.length - 1;
    
    // Clear and redraw the chart
    this.chartContext = canvas.getContext('2d');
    this.drawChart();
    this.setupSliderHandlers(canvas);
    this.chartLoaded = true;
  }

  getData(value: any) {
    if (value && value.length >= 2) {
      this.firstYearSelected = value[0];
      this.lastYearSelected = value[1];
      this.accessibleSelect();
    }
  }
}
export class TimeLineModule {}