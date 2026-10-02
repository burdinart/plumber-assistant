// Ленивые страницы: разбивают главный бандл по функциональным модулям.
// Использовать вместе с <Suspense>-обёрткой в AppLayout.
import { lazy } from 'react';

// CRM
export const ClientsPage = lazy(() => import('../../features/clients/ClientsPage').then(m => ({ default: m.ClientsPage })));
export const ClientForm = lazy(() => import('../../features/clients/components/ClientForm').then(m => ({ default: m.ClientForm })));
export const ClientCard = lazy(() => import('../../features/clients/components/ClientCard').then(m => ({ default: m.ClientCard })));
export const OrdersPage = lazy(() => import('../../features/orders/OrdersPage').then(m => ({ default: m.OrdersPage })));
export const OrderForm = lazy(() => import('../../features/orders/components/OrderForm').then(m => ({ default: m.OrderForm })));
export const OrderCard = lazy(() => import('../../features/orders/components/OrderCard').then(m => ({ default: m.OrderCard })));
export const RemindersPage = lazy(() => import('../../features/reminders/components/RemindersPage').then(m => ({ default: m.RemindersPage })));
export const PropertyList = lazy(() => import('../../features/objects/components/PropertyList').then(m => ({ default: m.PropertyList })));
export const PropertyForm = lazy(() => import('../../features/objects/components/PropertyForm').then(m => ({ default: m.PropertyForm })));
export const PropertyCard = lazy(() => import('../../features/objects/components/PropertyCard').then(m => ({ default: m.PropertyCard })));

// Финансы
export const FinanceDashboard = lazy(() => import('../../features/finance/components/FinanceDashboard').then(m => ({ default: m.FinanceDashboard })));
export const PriceList = lazy(() => import('../../features/finance/components/PriceList').then(m => ({ default: m.PriceList })));
export const EstimateList = lazy(() => import('../../features/finance/components/EstimateList').then(m => ({ default: m.EstimateList })));
export const EstimateForm = lazy(() => import('../../features/finance/components/EstimateForm').then(m => ({ default: m.EstimateForm })));
export const EstimatePreview = lazy(() => import('../../features/finance/components/EstimatePreview').then(m => ({ default: m.EstimatePreview })));
export const Transactions = lazy(() => import('../../features/finance/components/Transactions').then(m => ({ default: m.Transactions })));
export const TransactionForm = lazy(() => import('../../features/finance/components/TransactionForm').then(m => ({ default: m.TransactionForm })));
export const Reports = lazy(() => import('../../features/finance/components/Reports').then(m => ({ default: m.Reports })));

// Документы
export const DocumentsList = lazy(() => import('../../features/documents/components/DocumentsList').then(m => ({ default: m.DocumentsList })));
export const ActForm = lazy(() => import('../../features/documents/components/ActForm').then(m => ({ default: m.ActForm })));
export const ActPreview = lazy(() => import('../../features/documents/components/ActPreview').then(m => ({ default: m.ActPreview })));
export const ContractForm = lazy(() => import('../../features/documents/components/ContractForm').then(m => ({ default: m.ContractForm })));
export const ContractPreview = lazy(() => import('../../features/documents/components/ContractPreview').then(m => ({ default: m.ContractPreview })));
export const WarrantyForm = lazy(() => import('../../features/documents/components/WarrantyForm').then(m => ({ default: m.WarrantyForm })));
export const WarrantyPreview = lazy(() => import('../../features/documents/components/WarrantyPreview').then(m => ({ default: m.WarrantyPreview })));

// Калькуляторы и справочники
export const PressureCalculatorPage = lazy(() => import('../../features/pressure-calculator/PressureCalculatorPage').then(m => ({ default: m.PressureCalculatorPage })));
export const PipeDiameterPage = lazy(() => import('../../features/pipe-calculator/PipeDiameterPage').then(m => ({ default: m.PipeDiameterPage })));
export const WaterFlowPage = lazy(() => import('../../features/water-flow-calculator/WaterFlowPage').then(m => ({ default: m.WaterFlowPage })));
export const MaterialsReferencePage = lazy(() => import('../../features/materials-reference/MaterialsReferencePage').then(m => ({ default: m.MaterialsReferencePage })));
export const UnitsConverterPage = lazy(() => import('../../features/units-converter/UnitsConverterPage').then(m => ({ default: m.UnitsConverterPage })));
export const PipeLengthPage = lazy(() => import('../../features/pipe-length/PipeLengthPage').then(m => ({ default: m.PipeLengthPage })));
export const HeatLossPage = lazy(() => import('../../features/heat-loss/HeatLossPage').then(m => ({ default: m.HeatLossPage })));
export const SlopeCalculator = lazy(() => import('../../features/calculators/components/SlopeCalculator').then(m => ({ default: m.SlopeCalculator })));
export const BoilerErrors = lazy(() => import('../../features/reference/components/BoilerErrors').then(m => ({ default: m.BoilerErrors })));
export const Troubleshooting = lazy(() => import('../../features/reference/components/Troubleshooting').then(m => ({ default: m.Troubleshooting })));
export const RegulationsPage = lazy(() => import('../../features/reference/regulations/components/RegulationsPage').then(m => ({ default: m.RegulationsPage })));

// Проектирование
export const DesignHub = lazy(() => import('../../features/calculators/components/DesignHub').then(m => ({ default: m.DesignHub })));
export const PipeDiameterCalculator = lazy(() => import('../../features/calculators/components/PipeDiameterCalculator').then(m => ({ default: m.PipeDiameterCalculator })));
export const PumpCalculator = lazy(() => import('../../features/calculators/components/PumpCalculator').then(m => ({ default: m.PumpCalculator })));
export const ExpansionTankCalculator = lazy(() => import('../../features/calculators/components/ExpansionTankCalculator').then(m => ({ default: m.ExpansionTankCalculator })));
export const RadiatorCalculator = lazy(() => import('../../features/calculators/components/RadiatorCalculator').then(m => ({ default: m.RadiatorCalculator })));

// Прочее
export const AboutPage = lazy(() => import('../../features/app/components/AboutPage').then(m => ({ default: m.AboutPage })));
export const ProfilePage = lazy(() => import('../../features/profile/components/ProfilePage').then(m => ({ default: m.ProfilePage })));
