import { useState, useCallback, useEffect } from "react";
import { TableIcon } from "@radix-ui/react-icons";
import PricingCard from "../../components/pricing/PricingCard";
import Modal from "../../components/generic/modal/Modal.jsx"
import PricingForm from "../../components/pricing/PricingForm";
import PricingTable from "../../components/pricing/PricingTable";
import SuccessMessage from "../../components/generic/message/SuccessMessage.jsx"; // Fixed typos in import if any, original had Messaage/SuccessMessaage usage
import ErrorMessage from "../../components/generic/message/ErrorMessage.jsx";
import {getPaymentConcepts, updatePriceConcept} from "../../constant/DBFunctions.jsx"
import './pricing.css';

const Pricing = () => {

    const [concepts, setConcepts] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState('menu'); // 'menu' | 'table'

    const handleSave = async (id, newAmount) => {
        try {
            await updatePriceConcept({
                amount: newAmount,
                id: id,
            });

            // refrescar lista desde DB
            await fetchConcepts();

            //setSelectedPrice(null);
            setIsModalOpen(false);
            setMessage("Precio actualizado correctamente");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error(err);
            setError("Error al guardar el precio");
        }
    };


    const fetchConcepts = useCallback(async () => {
            setIsLoading(true);
            setError(null);
            try {
                const loadedData = await getPaymentConcepts(); 
                //const data = loadedData.find(c => c.name === "Otros")
                setConcepts(Array.isArray(loadedData) ? loadedData : []);
            } catch (e) {
                console.error("Error al cargar pagos:", e);
                setError("Error al cargar datos desde la base de datos local: " + e.message);
            } finally {
                setIsLoading(false);
            }
    }, []);

    useEffect(()=>{
        fetchConcepts();
    },[fetchConcepts]);
    
    if (view === 'table') {
        return <PricingTable onBack={() => setView('menu')} />;
    }

    const otrosConcept = concepts.find(c => c.name === 'Otros');

    return (
        <div className="container">
            <div className="content-wrapper">
                <div className="pricing-header">
                    <h2 className="section-title">Precios</h2>
                    <p className="subtitle">Configuración de costos y conceptos de pago.</p>
                </div>
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Cargando datos...</div>
            ) : (
                <div>
                    {message && (
                        <SuccessMessage
                            message={message}
                        />
                    )}
                <div className="grid">
                 
                 {/* Card for Curso/Tipo de Pago */}
                 <div
                    className="card"
                    onClick={() => setView('table')}
                    style={{ cursor: 'pointer' }}
                 >
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="card-icon"><TableIcon size={20} /></div>
                        <div>
                            <h4 className='card-title-price'>Curso / Tipo de Pago</h4>
                            <span className='card-category'>Configurar precios por curso</span>
                        </div>
                     </div>
                 </div>

                 {/* Card for Otros */}
                 {otrosConcept && (
                    <PricingCard
                        key={otrosConcept.id}
                        price={otrosConcept}
                        onClick={() => {
                            setIsModalOpen(true)
                            setSelectedPrice(otrosConcept)
                        }}
                    />
                 )}
            
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Actualizar Precio"
            >
                {error &&(
                    <ErrorMessage
                        message={error}
                    />
                )}
                <PricingForm
                    price={selectedPrice}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            </Modal>
                </div>
                </div>
            )}
            </div>
        </div>
  );
};

export default Pricing;