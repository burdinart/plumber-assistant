import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { DashboardPage } from '../../features/dashboard/DashboardPage';
import { PressureCalculatorPage } from '../../features/pressure-calculator/PressureCalculatorPage';
import { PipeDiameterPage } from '../../features/pipe-calculator/PipeDiameterPage';
import { WaterFlowPage } from '../../features/water-flow-calculator/WaterFlowPage';
import { MaterialsReferencePage } from '../../features/materials-reference/MaterialsReferencePage';
import { FittingsReferencePage } from '../../features/fittings-reference/FittingsReferencePage';
import { UnitsConverterPage } from '../../features/units-converter/UnitsConverterPage';
import { PipeLengthPage } from '../../features/pipe-length/PipeLengthPage';
import { HeatLossPage } from '../../features/heat-loss/HeatLossPage';
import { PumpSelectionPage } from '../../features/pump-selection/PumpSelectionPage';
import { SlopeCalculator } from '../../features/calculators/components/SlopeCalculator';
import { BoilerErrors } from '../../features/reference/components/BoilerErrors';
import { Troubleshooting } from '../../features/reference/components/Troubleshooting';
import { ClientsPage } from '../../features/clients/ClientsPage';
import { ClientForm } from '../../features/clients/components/ClientForm';
import { ClientCard } from '../../features/clients/components/ClientCard';
import { OrdersPage } from '../../features/orders/OrdersPage';
import { OrderForm } from '../../features/orders/components/OrderForm';
import { OrderCard } from '../../features/orders/components/OrderCard';
import { RemindersPage } from '../../features/reminders/RemindersPage';
import { ReminderForm } from '../../features/reminders/components/ReminderForm';

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
        element: <ClientsPage />,
      },
      {
        path: 'clients/new',
        element: <ClientForm />,
      },
      {
        path: 'clients/:id',
        element: <ClientCard />,
      },
      {
        path: 'clients/:id/edit',
        element: <ClientForm />,
      },
      // CRM - Orders
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'orders/new',
        element: <OrderForm />,
      },
      {
        path: 'orders/:id',
        element: <OrderCard />,
      },
      {
        path: 'orders/:id/edit',
        element: <OrderForm />,
      },
      // CRM - Reminders
      {
        path: 'reminders',
        element: <RemindersPage />,
      },
      {
        path: 'reminders/new',
        element: <ReminderForm />,
      },
      // Calculators
      {
        path: 'calculators/pressure',
        element: <PressureCalculatorPage />,
      },
      {
        path: 'calculators/pipe-diameter',
        element: <PipeDiameterPage />,
      },
      {
        path: 'calculators/water-flow',
        element: <WaterFlowPage />,
      },
      {
        path: 'calculators/pipe-length',
        element: <PipeLengthPage />,
      },
      {
        path: 'calculators/heat-loss',
        element: <HeatLossPage />,
      },
      {
        path: 'calculators/slope',
        element: <SlopeCalculator />,
      },
      // Reference
      {
        path: 'reference/materials',
        element: <MaterialsReferencePage />,
      },
      {
        path: 'reference/fittings',
        element: <FittingsReferencePage />,
      },
      {
        path: 'reference/boiler-errors',
        element: <BoilerErrors />,
      },
      {
        path: 'reference/troubleshooting',
        element: <Troubleshooting />,
      },
      // Tools
      {
        path: 'tools/units-converter',
        element: <UnitsConverterPage />,
      },
      // Planning
      {
        path: 'planning/pump-selection',
        element: <PumpSelectionPage />,
      },
      // Catch-all
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
