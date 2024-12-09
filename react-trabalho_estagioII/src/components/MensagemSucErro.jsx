import React from 'react'
import './Mensagem.css'

export default function MensagemSucErro({ tipo, mensagem, contadorSucessos }) {
    if (!mensagem) return null;

    return (
        <div className={`mensagem ${tipo}`}>
            <p>{mensagem}
            {tipo === 'sucesso' && contadorSucessos > 0 && (
                `(${contadorSucessos})`
            )}
            </p>
        </div>
    );
}