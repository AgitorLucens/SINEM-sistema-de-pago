import { useState, useCallback, useEffect } from "react";
import PricingCard from "../../components/pricing/PricingCard";
import Modal from "../../components/generic/modal/Modal.jsx"
import PricingForm from "../../components/pricing/PricingForm";

import {getPaymentConcepts,updatePriceConcept} from "../../constant/PaymentConstant.jsx"

const Pricing = () => {

    const [concepts, setConcepts] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(null);
    const [error, setError] = useState(null);


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
            //setIsLoading(true);
            setError(null);
            try {
                const loadedData = await getPaymentConcepts(); 

                setConcepts(Array.isArray(loadedData) ? loadedData : []);
            } catch (e) {
                console.error("Error al cargar pagos:", e);
                setError("Error al cargar datos desde la base de datos local: " + e.message);
            } finally {
                //setIsLoading(false);
            }
    }, []);

    useEffect(()=>{
        fetchConcepts();
    },[fetchConcepts]);
    

    return (
        <div style={{ padding: "2rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Pricing</h1>

        <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
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
        </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Precio a escoger"
            >
                <PricingForm
                    price={selectedPrice}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            </Modal>
  
        </div>
  );
};

export default Pricing;