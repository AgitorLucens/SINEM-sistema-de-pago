import { useState, useCallback, useEffect } from "react";
import PricingCard from "../../components/pricing/PricingCard";
import Modal from "../../components/generic/modal/Modal.jsx"
import PricingForm from "../../components/pricing/PricingForm";
import ErrorMessage from "../../components/generic/message/ErrorMessage.jsx";
import SuccessMessage from "../../components/generic/message/SuccessMessage.jsx";
import {getPaymentConcepts,updatePriceConcept} from "../../constant/DBFunctions.jsx"
import './pricing.css';
const Pricing = () => {

    const [concepts, setConcepts] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(null);
    const [error, setError] = useState("");
    const [message,setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
        } catch (err) {
            console.error(err);
            alert("Error al guardar el precio");
        }
    };


    const fetchConcepts = useCallback(async () => {
            setIsLoading(true);
            setError(null);
            try {
                const loadedData = await getPaymentConcepts(); 

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
    

    return (
        <div className="container">
            <div className="content-wrapper">
                <div className="header">
                    <h2 className="title">Precios</h2>
                    <p className="subtitle">Configuración de costos y conceptos de pago.</p>
                </div>
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Cargando datos...</div>
            ) : (
                <div>
                    {message && (
                        <SuccessMessaage
                            message={message}
                        />
                    )}
                <div className="grid">
                 
                {concepts.map(price => (
                    <PricingCard
                        key={price.id}
                        price={price}
                        onClick={() => {
                            setIsModalOpen(true)
                            setSelectedPrice(price)
                        }}
                    />
                ))}

            
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Actualizar Precio"
            >
                {error &&(
                    <ErrorMessage
                        message={messaage}
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