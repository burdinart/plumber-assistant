import { createBrowserRouter, Navigate } from 'react-router-dom';
import * as P from './lazyPages';
import { AppLayout } from '../layouts/AppLayout';
// Dashboard — первая экранная точка входа, грузится eagerly (без Suspense-задержки)
import { DashboardPage } from '../../features/dashboard/DashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      // CRM - Clients
      {
        path: 'clients',
        element: <P.ClientsPage />,
      },
      {
        path: 'clients/new',
        element: <P.ClientForm />,
      },
      {
        path: 'clients/:id',
        element: <P.ClientCard />,
      },
      {
        path: 'clients/:id/edit',
        element: <P.ClientForm />,
      },
      // CRM - Objects (Properties)
      {
        path: 'objects',
        element: <P.PropertyList />,
      },
      {
        path: 'objects/new',
        element: <P.PropertyForm />,
      },
      {
        path: 'objects/:id',
        element: <P.PropertyCard />,
      },
      {
        path: 'objects/:id/edit',
        element: <P.PropertyForm />,
      },
      // CRM - Orders
      {
        path: 'orders',
        element: <P.OrdersPage />,
      },
      {
        path: 'orders/new',
        element: <P.OrderForm />,
      },
      {
        path: 'orders/:id',
        element: <P.OrderCard />,
      },
      {
        path: 'orders/:id/edit',
        element: <P.OrderForm />,
      },
      // CRM - Reminders (Напоминания)
      {
        path: 'reminders',
        element: <P.RemindersPage />,
      },
      // Calculators
      {
        path: 'calculators/pressure',
        element: <P.PressureCalculatorPage />,
      },
      {
        path: 'calculators/pipe-diameter',
        element: <P.PipeDiameterPage />,
      },
      {
        path: 'calculators/water-flow',
        element: <P.WaterFlowPage />,
      },
      {
        path: 'calculators/pipe-length',
        element: <P.PipeLengthPage />,
      },
      {
        path: 'calculators/heat-loss',
        element: <P.HeatLossPage />,
      },
      {
        path: 'calculators/slope',
        element: <P.SlopeCalculator />,
      },
      // Reference
      {
        path: 'reference/materials',
        element: <P.MaterialsReferencePage />,
      },
      {
        path: 'reference/regulations',
        element: <P.RegulationsPage />,
      },
      {
        path: 'reference/boiler-errors',
        element: <P.BoilerErrors />,
      },
      {
        path: 'reference/troubleshooting',
        element: <P.Troubleshooting />,
      },
      // Tools
      {
        path: 'tools/units-converter',
        element: <P.UnitsConverterPage />,
      },
      // Finance
      {
        path: 'finance',
        element: <P.FinanceDashboard />,
      },
      {
        path: 'finance/price-list',
        element: <P.PriceList />,
      },
      {
        path: 'finance/estimates',
        element: <P.EstimateList />,
      },
      {
        path: 'finance/estimates/new',
        element: <P.EstimateForm />,
      },
      {
        path: 'finance/estimates/:id',
        element: <P.EstimateForm />,
      },
      {
        path: 'finance/estimates/:id/preview',
        element: <P.EstimatePreview />,
      },
      {
        path: 'finance/transactions',
        element: <P.Transactions />,
      },
      {
        path: 'finance/transactions/new',
        element: <P.TransactionForm />,
      },
      {
        path: 'finance/reports',
        element: <P.Reports />,
      },
      // Documents
      {
        path: 'documents',
        element: <P.DocumentsList />,
      },
      {
        path: 'documents/acts/new',
        element: <P.ActForm />,
      },
      {
        path: 'documents/acts/:id',
        element: <P.ActPreview />,
      },
      {
        path: 'documents/acts/:id/edit',
        element: <P.ActForm />,
      },
      {
        path: 'documents/contracts/new',
        element: <P.ContractForm />,
      },
      {
        path: 'documents/contracts/:id',
        element: <P.ContractPreview />,
      },
      {
        path: 'documents/contracts/:id/edit',
        element: <P.ContractForm />,
      },
      {
        path: 'documents/warranties/new',
        element: <P.WarrantyForm />,
      },
      {
        path: 'documents/warranties/:id',
        element: <P.WarrantyPreview />,
      },
      {
        path: 'documents/warranties/:id/edit',
        element: <P.WarrantyForm />,
      },
      // Design - Проектирование
      {
        path: 'design',
        element: <P.DesignHub />,
      },
      {
        path: 'design/pipe-diameter',
        element: <P.PipeDiameterCalculator />,
      },
      {
        path: 'design/pump',
        element: <P.PumpCalculator />,
      },
      {
        path: 'design/expansion-tank',
        element: <P.ExpansionTankCalculator />,
      },
      {
        path: 'design/radiator',
        element: <P.RadiatorCalculator />,
      },
      // О приложении
      {
        path: 'about',
        element: <P.AboutPage />,
      },
      // Настройки и Профиль
      {
        path: 'settings/profile',
        element: <P.ProfilePage />,
      },
      // Catch-all
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
], { basename: '/plumber-assistant' });
