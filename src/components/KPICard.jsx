
import React from 'react'

const KPICard = ({ title, value, icon, className = "" }) => {

    return (
        <div
            className={`
        rounded-3xl
        p-6
        shadow-xl
        hover:scale-105
        transition
        flex
        justify-between
        items-center
        print:shadow-none
        ${className}
      `}
        >
            <div>
                <p className="font-medium opacity-90">{title}</p>
                <h2 className="text-5xl font-black mt-4">{value}</h2>
            </div>

            {icon && (
                <div className="flex-shrink-0 opacity-80">
                    {icon}
                </div>
            )}
        </div>
    );
}

export default KPICard