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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      // Калькуляторы
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
      // Справочники
      {
        path: 'reference/materials',
        element: <MaterialsReferencePage />,
      },
      {
        path: 'reference/fittings',
        element: <FittingsReferencePage />,
      },
      // Инструменты
      {
        path: 'tools/units-converter',
        element: <UnitsConverterPage />,
      },
      // Проектирование
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
