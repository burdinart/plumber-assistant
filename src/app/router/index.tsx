import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { DashboardPage } from '../../features/dashboard/DashboardPage';
import { PressureCalculatorPage } from '../../features/pressure-calculator/PressureCalculatorPage';
import { PipeDiameterPage } from '../../features/pipe-calculator/PipeDiameterPage';
import { WaterFlowPage } from '../../features/water-flow-calculator/WaterFlowPage';
import { MaterialsReferencePage } from '../../features/materials-reference/MaterialsReferencePage';
import { UnitsConverterPage } from '../../features/units-converter/UnitsConverterPage';
import { PipeLengthPage } from '../../features/pipe-length/PipeLengthPage';
import { HeatLossPage } from '../../features/heat-loss/HeatLossPage';
import { SlopeCalculator } from '../../features/calculators/components/SlopeCalculator';
import { BoilerErrors } from '../../features/reference/components/BoilerErrors';
import { Troubleshooting } from '../../features/reference/components/Troubleshooting';
import { ClientsPage } from '../../features/clients/ClientsPage';
import { ClientForm } from '../../features/clients/components/ClientForm';
import { ClientCard } from '../../features/clients/components/ClientCard';
import { OrdersPage } from '../../features/orders/OrdersPage';
import { OrderForm } from '../../features/orders/components/OrderForm';
import { OrderCard } from '../../features/orders/components/OrderCard';
import { FinanceDashboard } from '../../features/finance/components/FinanceDashboard';
import { PriceList } from '../../features/finance/components/PriceList';
import { EstimateList } from '../../features/finance/components/EstimateList';
import { EstimateForm } from '../../features/finance/components/EstimateForm';
import { EstimatePreview } from '../../features/finance/components/EstimatePreview';
import { Transactions } from '../../features/finance/components/Transactions';
import { TransactionForm } from '../../features/finance/components/TransactionForm';
import { Reports } from '../../features/finance/components/Reports';
import { DocumentsList } from '../../features/documents/components/DocumentsList';
import { ActForm } from '../../features/documents/components/ActForm';
import { ActPreview } from '../../features/documents/components/ActPreview';
import { ContractForm } from '../../features/documents/components/ContractForm';
import { ContractPreview } from '../../features/documents/components/ContractPreview';
import { WarrantyForm } from '../../features/documents/components/WarrantyForm';
import { WarrantyPreview } from '../../features/documents/components/WarrantyPreview';
import { PropertyList } from '../../features/objects/components/PropertyList';
import { PropertyForm } from '../../features/objects/components/PropertyForm';
import { PropertyCard } from '../../features/objects/components/PropertyCard';
import { DesignHub } from '../../features/calculators/components/DesignHub';
import { PipeDiameterCalculator } from '../../features/calculators/components/PipeDiameterCalculator';
import { PumpCalculator } from '../../features/calculators/components/PumpCalculator';
import { ExpansionTankCalculator } from '../../features/calculators/components/ExpansionTankCalculator';
import { RadiatorCalculator } from '../../features/calculators/components/RadiatorCalculator';
import { RegulationsPage } from '../../features/reference/regulations/components/RegulationsPage';
import { CostCalculatorPage } from '../../features/calculators/cost/components/CostCalculatorPage';
import { AboutPage } from '../../features/app/components/AboutPage';

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
      // CRM - Objects (Properties)
      {
        path: 'objects',
        element: <PropertyList />,
      },
      {
        path: 'objects/new',
        element: <PropertyForm />,
      },
      {
        path: 'objects/:id',
        element: <PropertyCard />,
      },
      {
        path: 'objects/:id/edit',
        element: <PropertyForm />,
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
        path: 'reference/regulations',
        element: <RegulationsPage />,
      },
      {
        path: 'reference/boiler-errors',
        element: <BoilerErrors />,
      },
      {
        path: 'reference/troubleshooting',
        element: <Troubleshooting />,
      },
      // Calculators - Cost
      {
        path: 'calculators/cost',
        element: <CostCalculatorPage />,
      },
      // Tools
      {
        path: 'tools/units-converter',
        element: <UnitsConverterPage />,
      },
      // Finance
      {
        path: 'finance',
        element: <FinanceDashboard />,
      },
      {
        path: 'finance/price-list',
        element: <PriceList />,
      },
      {
        path: 'finance/estimates',
        element: <EstimateList />,
      },
      {
        path: 'finance/estimates/new',
        element: <EstimateForm />,
      },
      {
        path: 'finance/estimates/:id',
        element: <EstimateForm />,
      },
      {
        path: 'finance/estimates/:id/preview',
        element: <EstimatePreview />,
      },
      {
        path: 'finance/transactions',
        element: <Transactions />,
      },
      {
        path: 'finance/transactions/new',
        element: <TransactionForm />,
      },
      {
        path: 'finance/reports',
        element: <Reports />,
      },
      // Documents
      {
        path: 'documents',
        element: <DocumentsList />,
      },
      {
        path: 'documents/acts/new',
        element: <ActForm />,
      },
      {
        path: 'documents/acts/:id',
        element: <ActPreview />,
      },
      {
        path: 'documents/contracts/new',
        element: <ContractForm />,
      },
      {
        path: 'documents/contracts/:id',
        element: <ContractPreview />,
      },
      {
        path: 'documents/warranties/new',
        element: <WarrantyForm />,
      },
      {
        path: 'documents/warranties/:id',
        element: <WarrantyPreview />,
      },
      // Design - Проектирование
      {
        path: 'design',
        element: <DesignHub />,
      },
      {
        path: 'design/pipe-diameter',
        element: <PipeDiameterCalculator />,
      },
      {
        path: 'design/pump',
        element: <PumpCalculator />,
      },
      {
        path: 'design/expansion-tank',
        element: <ExpansionTankCalculator />,
      },
      {
        path: 'design/radiator',
        element: <RadiatorCalculator />,
      },
      // О приложении
      {
        path: 'about',
        element: <AboutPage />,
      },
      // Catch-all
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
], { basename: '/plumber-assistant' });
