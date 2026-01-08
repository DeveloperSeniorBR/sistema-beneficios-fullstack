import { Component } from '@angular/core';
import { BeneficioListComponent } from './components/beneficio-list/beneficio-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BeneficioListComponent],
  template: `
    <div class="app-container">
      <header>
        <h1>Sistema de Gerenciamento de Benefícios</h1>
      </header>
      <main>
        <app-beneficio-list></app-beneficio-list>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    header {
      background-color: #3f51b5;
      color: white;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    header h1 {
      margin: 0;
      font-size: 24px;
    }

    main {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {
  title = 'Sistema de Benefícios';
}
