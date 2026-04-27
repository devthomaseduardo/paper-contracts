import React, { useState } from 'react';
import { Printer, Copy, CheckCircle2, Download, Loader2, Eye, EyeOff, Trash2 } from 'lucide-react';

export const ContractPreview = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);

  const handlePrint = () => window.print();

  const handleCopy = () => {
    const text = document.getElementById('printable-content')?.innerText || '';
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatCurrency = (val) => {
      if (typeof val === 'number') return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const numeric = parseFloat(val?.toString().replace('R$', '').replace('.', '').replace(',', '.') || '0');
      return numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('printable-content');
    if (!element || !window.html2pdf) {
      alert('Biblioteca de PDF não carregada. Recarregue a página.');
      return;
    }

    setIsDownloading(true);

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '210mm';
    container.style.backgroundColor = '#ffffff';
    container.style.zIndex = '-9999';

    const clone = element.cloneNode(true);
    
    clone.style.width = '100%';
    clone.style.margin = '0';
    clone.style.position = 'relative';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.boxShadow = 'none';
    clone.style.display = 'block';

    container.appendChild(clone);
    document.body.appendChild(container);

    const opt = {
      margin: 0, 
      filename: `${data.type}_${data.clientName || 'document'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 3, 
        useCORS: true, 
        letterRendering: true, 
        scrollY: 0,
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    try {
        await window.html2pdf().set(opt).from(clone).save();
    } catch (err) {
        console.error(err);
        alert('Erro ao gerar PDF.');
    } finally {
        document.body.removeChild(container);
        setIsDownloading(false);
    }
  };

  // --- SUB-COMPONENTES DE RENDERIZAÇÃO ---

  const SignatureBlock = () => (
      <div className="mt-16 pt-8 border-t border-black flex justify-between gap-8 break-inside-avoid">
            <div className="flex-1 text-center flex flex-col items-center">
                <div className="h-16 w-full flex items-end justify-center mb-2">
                    {data.contractorSignature ? (
                        <img src={data.contractorSignature} alt="Signature" className="h-16 object-contain" />
                    ) : (
                        <div className="text-xs text-gray-300 italic mb-2">Assinado digitalmente</div>
                    )}
                </div>
                <p className="font-bold uppercase text-sm border-t border-black w-full pt-2">{data.contractorName}</p>
                <p className="text-xs text-gray-600">{data.contractorDoc}</p>
                <p className="text-[10px] uppercase tracking-wide mt-1 text-gray-500">CONTRATADO</p>
            </div>
            <div className="flex-1 text-center flex flex-col items-center justify-end">
                <div className="h-16 w-full mb-2"></div>
                <p className="font-bold uppercase text-sm border-t border-black w-full pt-2">{data.clientName || 'Cliente'}</p>
                <p className="text-xs text-gray-600">{data.clientDoc}</p>
                <p className="text-[10px] uppercase tracking-wide mt-1 text-gray-500">CONTRATANTE</p>
            </div>
        </div>
  );

  const Header = ({ simple = false }) => (
      <div className="border-b-2 pb-6 mb-8 flex justify-between items-start break-inside-avoid" style={{ borderColor: data.accentColor }}>
          <div className="flex items-center gap-6">
              {data.contractorLogo && <img src={data.contractorLogo} alt="Logo" className="h-20 w-auto object-contain" />}
              <div>
                  <h1 className="text-2xl font-bold uppercase tracking-tight text-gray-900">{data.contractorName}</h1>
                  <p className="text-sm font-medium uppercase tracking-wider mt-1" style={{ color: data.accentColor }}>{data.contractorRole}</p>
              </div>
          </div>
          {!simple && (
              <div className="text-right text-xs text-gray-500 leading-relaxed">
                  <p>{data.contractorLocation}</p>
                  <p>{data.contractorContact}</p>
                  <p>{data.contractorDoc}</p>
              </div>
          )}
      </div>
  );

  // --- TEMPLATES ---

  const renderContract = () => (
    <>
        <Header />
        <div className="text-center mb-10 break-inside-avoid relative">
            <h2 className="font-serif font-bold text-xl uppercase tracking-widest text-gray-900">
                {data.type === 'nda' ? 'Acordo de Confidencialidade (NDA)' : 'Contrato de Prestação de Serviços'}
            </h2>
            <div className="w-24 h-1 mx-auto mt-2" style={{ backgroundColor: data.accentColor }}></div>
        </div>
        
        {data.type === 'nda' ? (
            <div className="mb-8 text-justify font-serif leading-relaxed text-gray-800 break-inside-avoid text-[11pt]">
                <p className="mb-4">
                    Pelo presente instrumento particular de <strong>ACORDO DE CONFIDENCIALIDADE E SIGILO</strong>, de um lado <strong>{data.contractorName}</strong>, inscrito no CNPJ/CPF sob o nº {data.contractorDoc}, doravante denominado simplesmente <strong>CONTRATADO</strong>, e de outro lado <strong>{data.clientName || '________________'}</strong>, inscrito no CNPJ/CPF sob o nº {data.clientDoc || '________________'}, doravante denominado <strong>CONTRATANTE</strong>, têm entre si justo e contratado o quanto segue:
                </p>
                <div className="space-y-4">
                    <div className="break-inside-avoid">
                        <h3 className="font-bold uppercase text-sm mb-2 text-black">1. OBJETO</h3>
                        <p>O presente acordo visa garantir o sigilo absoluto de todas as informações técnicas, comerciais, segredos de negócio e dados sensíveis compartilhados entre as partes durante a vigência da prestação de serviços ou negociações preliminares.</p>
                    </div>
                    <div className="break-inside-avoid">
                        <h3 className="font-bold uppercase text-sm mb-2 text-black">2. DEFINIÇÃO DE INFORMAÇÃO CONFIDENCIAL</h3>
                        <p>Considera-se informação confidencial todo e qualquer dado, software, código-fonte, banco de dados, estratégia de marketing ou lista de clientes, seja em meio físico ou digital, que não seja de domínio público.</p>
                    </div>
                    <div className="break-inside-avoid">
                        <h3 className="font-bold uppercase text-sm mb-2 text-black">3. OBRIGAÇÕES</h3>
                        <p>As partes comprometem-se a não divulgar, reproduzir ou utilizar as informações para fins diversos do acordado, sob pena de responsabilidade civil e criminal, respondendo por perdas e danos e lucros cessantes.</p>
                    </div>
                    <div className="break-inside-avoid">
                        <h3 className="font-bold uppercase text-sm mb-2 text-black">4. FORO</h3>
                        <p>Para dirimir quaisquer controvérsias oriundas deste ajuste, as partes elegem o Foro da Comarca de <strong>{data.forumCity.split('-')[0].trim()}</strong>, com renúncia expressa a qualquer outro por mais privilegiado que seja.</p>
                    </div>
                </div>
            </div>
        ) : (
            <div className="mb-8 text-justify font-serif leading-relaxed text-gray-800 break-inside-avoid text-[11pt]">
                <p className="mb-6">
                    Pelo presente instrumento particular de <strong>CONTRATO DE PRESTAÇÃO DE SERVIÇOS TÉCNICOS</strong>, de um lado <strong>{data.contractorName}</strong>, com sede/residência em {data.contractorLocation}, inscrito no CNPJ/CPF sob o nº {data.contractorDoc}, doravante denominado <strong>CONTRATADO</strong>, e de outro lado <strong>{data.clientName || '________________'}</strong>, residente/sediado em {data.clientAddress || '________________'}, inscrito no CNPJ/CPF sob o nº {data.clientDoc || '________________'}, doravante denominado <strong>CONTRANTE</strong>, celebram o presente contrato sob as cláusulas abaixo:
                </p>

                <div className="space-y-6">
                    <div className="break-inside-avoid">
                        <h3 className="font-bold uppercase text-sm mb-2 text-black">1. OBJETO DO CONTRATO</h3>
                        <p>O objeto deste contrato é a prestação de serviços especializados em <strong>{data.contractorRole}</strong>, compreendendo as seguintes atividades:</p>
                        <ul className="list-disc ml-8 mt-2 space-y-1">
                            {data.services.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>

                    <div className="break-inside-avoid">
                        <h3 className="font-bold uppercase text-sm mb-2 text-black">2. VALORES E FORMA DE PAGAMENTO</h3>
                        <p>
                           Pelo serviço ora contratado, o <strong>CONTRATANTE</strong> pagará ao <strong>CONTRATADO</strong> o valor total bruto de <strong>{formatCurrency(data.valueTotal)}</strong>.
                        </p>
                        <p className="mt-2">
                           O pagamento será efetuado da seguinte forma: 50% (<strong>{formatCurrency(data.valueEntry)}</strong>) a título de sinal e princípio de pagamento para mobilização técnica, e o saldo remanescente de 50% (<strong>{formatCurrency(data.valueBalance)}</strong>) na entrega final ou na data de <strong>{data.balanceDate}</strong>.
                        </p>
                        <p className="mt-2 text-sm italic">O atraso em qualquer parcela sujeitará o Contratante à multa de 2% (dois por cento) sobre o valor da parcela devida, acrescida de juros de mora de 1% (um por cento) ao mês.</p>
                    </div>

                    <div className="break-inside-avoid">
                        <h3 className="font-bold uppercase text-sm mb-2 text-black">3. PRAZO DE ENTREGA</h3>
                        <p>O prazo estimado para a entrega dos serviços é de <strong>{data.deliveryDays} dias úteis</strong>, contados a partir da confirmação do pagamento do sinal e do envio de todos os ativos/informações necessários pelo Contratante.</p>
                    </div>

                    <div className="break-inside-avoid">
                        <h3 className="font-bold uppercase text-sm mb-2 text-black">4. PROPRIEDADE INTELECTUAL</h3>
                        <p>Após a quitação integral dos valores, o Contratante detém os direitos de uso do produto final. O Contratado reserva-se o direito de mencionar o projeto em seu portfólio profissional e manter a autoria intelectual sobre frameworks e códigos base preexistentes.</p>
                    </div>

                    <div className="break-inside-avoid">
                        <h3 className="font-bold uppercase text-sm mb-2 text-black">5. RESPONSABILIDADES</h3>
                        <p><strong>Do Contratado:</strong> Prestar os serviços com diligência, observando as boas práticas de desenvolvimento e os prazos acordados.</p>
                        <p><strong>Do Contratante:</strong> Fornecer o suporte necessário, materiais básicos e efetuar os pagamentos nas datas aprazadas.</p>
                    </div>

                    <div className="break-inside-avoid">
                        <h3 className="font-bold uppercase text-sm mb-2 text-black">6. FORO</h3>
                        <p>As partes elegem o Foro da Comarca de <strong>{data.forumCity.split('-')[0].trim()}</strong> para dirimir quaisquer litígios oriundos deste contrato, renunciando a qualquer outro, por mais privilegiado que seja.</p>
                    </div>

                     {data.timeline && data.timeline.length > 0 && (
                        <div className="break-inside-avoid mt-8">
                            <h3 className="font-bold uppercase text-sm mb-4 text-black border-b border-gray-200 pb-2">CRONOGRAMA ESTIMADO</h3>
                            <div className="space-y-4">
                                 {data.timeline.map((item, i) => (
                                    <div key={i} className="flex gap-6">
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 rounded-full border-2 border-gray-900 bg-white z-10" />
                                            {i < data.timeline.length - 1 && <div className="w-[1px] h-full bg-gray-200" />}
                                        </div>
                                        <div className="pb-6">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-bold text-xs uppercase tracking-widest text-gray-900">{item.phase}</span>
                                                <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{item.duration}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-600 leading-relaxed max-w-lg">{item.deliverables}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                     )}

                     {data.extraClauses && (
                        <div className="break-inside-avoid mt-8 border-t border-gray-300 pt-4">
                            <h3 className="font-bold uppercase text-sm mb-2 text-black">OBSERVAÇÕES ADICIONAIS</h3>
                            <p className="whitespace-pre-wrap">{data.extraClauses}</p>
                        </div>
                    )}
                </div>
            </div>
        )}


        <div className="mt-12 text-center text-sm font-serif italic text-gray-500 break-inside-avoid">
            {data.contractorLocation.split('-')[0].trim()}, {data.contractDate}.
        </div>

        <SignatureBlock />
    </>
  );

  const renderQuoteOrInvoice = () => {
    const isInvoice = data.type === 'invoice';
    const total = data.quoteItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    return (
        <div className="font-sans">
            <div className="flex justify-between items-start mb-12">
                <div className="flex items-start gap-4">
                    {data.contractorLogo && <img src={data.contractorLogo} alt="Logo" className="h-16 w-auto object-contain mt-1" />}
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight uppercase">{isInvoice ? 'Nota Fiscal / Recibo' : 'Orçamento'}</h1>
                        <p className="text-gray-500 font-medium mt-1">Ref: {isInvoice ? `#${data.invoiceId}` : `${data.type.toUpperCase()}-001`}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="font-bold text-gray-900 text-lg">{data.contractorName}</h2>
                    <p className="text-sm text-gray-500">{data.contractorDoc}</p>
                    <p className="text-sm text-gray-500">{data.contractorContact}</p>
                </div>
            </div>

            <div className="flex justify-between bg-gray-50 rounded-lg p-6 mb-10 border border-gray-100 break-inside-avoid">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cliente / Tomador</p>
                    <p className="font-bold text-lg text-gray-900">{data.clientName}</p>
                    <p className="text-sm text-gray-600">{data.clientAddress}</p>
                    <p className="text-sm text-gray-600">{data.clientDoc}</p>
                </div>
                <div className="text-right">
                    <div className="mb-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Emissão</p>
                        <p className="font-medium text-gray-900">{isInvoice ? data.invoiceIssueDate : data.contractDate}</p>
                    </div>
                    <div>
                         {isInvoice && data.status === 'paid' ? (
                            <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded font-bold text-xs uppercase inline-block">Pago</div>
                         ) : isInvoice ? (
                            <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded font-bold text-xs uppercase inline-block">Em Aberto</div>
                         ) : (
                             <>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Válido Até</p>
                                <p className="font-medium text-emerald-600">{data.quoteValidUntil}</p>
                             </>
                         )}
                    </div>
                </div>
            </div>

            <table className="w-full mb-8 border-collapse">
                <thead className="text-white rounded-t-lg" style={{ backgroundColor: data.accentColor }}>
                    <tr>
                        <th className="text-left py-3 px-4 font-bold uppercase text-xs tracking-wider rounded-tl-lg">Descrição</th>
                        <th className="text-center py-3 px-4 font-bold uppercase text-xs tracking-wider w-24">Qtd</th>
                        <th className="text-right py-3 px-4 font-bold uppercase text-xs tracking-wider w-32">Unitário</th>
                        <th className="text-right py-3 px-4 font-bold uppercase text-xs tracking-wider w-32 rounded-tr-lg">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.quoteItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4 text-sm font-medium text-gray-800">{item.description}</td>
                            <td className="text-center py-4 px-4 text-sm text-gray-600">{item.quantity}</td>
                            <td className="text-right py-4 px-4 text-sm text-gray-600">{formatCurrency(item.unitPrice)}</td>
                            <td className="text-right py-4 px-4 text-sm font-bold text-gray-900">{formatCurrency(item.quantity * item.unitPrice)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3} className="text-right py-6 px-4 font-bold text-xl uppercase tracking-tight text-gray-900">Total</td>
                        <td className="text-right py-6 px-4 font-extrabold text-xl" style={{ color: data.accentColor }}>{formatCurrency(total)}</td>
                    </tr>
                </tfoot>
            </table>

            {isInvoice && (
                <div className="mb-8 p-4 bg-slate-50 border border-dashed border-slate-300 rounded text-xs text-slate-500 text-justify">
                    <strong>Nota:</strong> Este documento comprova a prestação de serviços por profissional autônomo. Para fins contábeis e fiscais, verifique a legislação local sobre retenção de impostos (ISS/IRRF).
                </div>
            )}

            {data.extraClauses && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-3">Observações</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{data.extraClauses}</p>
                </div>
            )}

            {data.pixKey && (
                <div className="mt-8 p-4 bg-gray-50 rounded-xl border-2 border-dashed flex items-center gap-6 break-inside-avoid" style={{ borderColor: `${data.accentColor}20` }}>
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(data.pixKey)}`} 
                            alt="QR Code Pix" 
                            className="w-20 h-20"
                        />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Pagamento via PIX</p>
                        <div className="flex items-center gap-3">
                            <p className="text-sm font-mono font-bold text-gray-900">{data.pixKey}</p>
                            <button 
                                onClick={() => navigator.clipboard.writeText(data.pixKey)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-400 hover:text-gray-600"
                                title="Copiar Chave"
                            >
                                <Copy size={14} />
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">Escaneie o QR Code acima ou copie a chave para pagar.</p>
                    </div>
                </div>
            )}
            
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                 <p className="text-sm font-medium text-gray-900 mb-4">{isInvoice ? 'Prestador:' : 'Aprovado por:'}</p>
                 <div className="w-64 h-12 border-b border-gray-300 mx-auto mb-2">
                      {isInvoice && data.contractorSignature && <img src={data.contractorSignature} className="h-12 mx-auto object-contain" />}
                 </div>
                 <p className="text-xs text-gray-500 uppercase">{isInvoice ? data.contractorName : 'Assinatura do Cliente'}</p>
            </div>
        </div>
    );
  };

  const renderCV = () => (
      <div className="font-sans text-gray-900 bg-white">

          {/* === HEADER BAND === */}
          <div style={{
              backgroundColor: data.accentColor,
              margin: '-25mm -20mm 0 -30mm',
              padding: '12mm 20mm 10mm 30mm',
              marginBottom: '8mm',
          }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                      <h1 style={{ color: 'white', fontSize: '22pt', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, lineHeight: 1.1 }}>
                          {data.contractorName}
                      </h1>
                      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '10pt', fontWeight: '500', marginTop: '2mm', letterSpacing: '0.06em' }}>
                          {data.contractorRole}
                      </p>
                  </div>
                  {data.contractorLogo && (
                      <img src={data.contractorLogo} alt="Logo" style={{ height: '20mm', width: '20mm', objectFit: 'cover', borderRadius: '50%', border: '1.5pt solid rgba(255,255,255,0.4)' }} />
                  )}
              </div>

              {/* Contact row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5mm', marginTop: '5mm', paddingTop: '4mm', borderTop: '0.5pt solid rgba(255,255,255,0.25)' }}>
                  {[
                      data.contractorContact,
                      data.contractorLocation,
                      data.contractorDoc,
                      data.contractorLinkedin,
                      data.contractorGithub,
                      data.contractorPortfolio,
                  ].filter(Boolean).map((item, i) => (
                      <span key={i} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '7pt', display: 'flex', alignItems: 'center', gap: '1.5mm' }}>
                          <span style={{ width: '1.5mm', height: '1.5mm', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.5)', display: 'inline-block', flexShrink: 0 }}></span>
                          {item}
                      </span>
                  ))}
              </div>
          </div>

          {/* === SKILLS CHIPS === */}
          {data.cvSkills && data.cvSkills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2mm', marginBottom: '7mm' }}>
                  {data.cvSkills.map((skill, i) => (
                      <span key={i} style={{
                          fontSize: '6.5pt', fontWeight: '700',
                          color: data.accentColor,
                          border: `0.5pt solid ${data.accentColor}`,
                          padding: '1mm 3mm', borderRadius: '50mm',
                          letterSpacing: '0.04em',
                      }}>{skill}</span>
                  ))}
              </div>
          )}

          {/* === SECTIONS === */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>

              {data.cvSummary && (
                  <div style={{ breakInside: 'avoid' }}>
                      <p style={{ fontSize: '6.5pt', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: data.accentColor, marginBottom: '2.5mm' }}>
                          Resumo Profissional
                      </p>
                      <p style={{ fontSize: '8pt', lineHeight: '1.75', color: '#374151', textAlign: 'justify', whiteSpace: 'pre-line' }}>
                          {data.cvSummary}
                      </p>
                  </div>
              )}

              {data.cvExperience && (
                  <div>
                      <p style={{ fontSize: '6.5pt', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: data.accentColor, marginBottom: '2.5mm' }}>
                          Experiência Profissional
                      </p>
                      <div style={{ fontSize: '8pt', lineHeight: '1.75', color: '#374151', whiteSpace: 'pre-line' }}>
                          {data.cvExperience}
                      </div>
                  </div>
              )}

              {data.cvEducation && (
                  <div style={{ breakInside: 'avoid' }}>
                      <p style={{ fontSize: '6.5pt', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: data.accentColor, marginBottom: '2.5mm' }}>
                          Formação Acadêmica
                      </p>
                      <div style={{ fontSize: '8pt', lineHeight: '1.75', color: '#374151', whiteSpace: 'pre-line' }}>
                          {data.cvEducation}
                      </div>
                  </div>
              )}
          </div>
      </div>
  );

  const renderCoverLetter = () => (
      <>
        <Header />
        <div className="mt-12 text-justify font-serif text-[11pt] leading-loose text-gray-900">
            <div className="flex justify-between items-end mb-12 border-b border-gray-200 pb-4">
                 <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Para:</p>
                    <p className="font-bold text-lg">{data.clientName || 'Ao Gestor de Contratação'}</p>
                 </div>
                 <p className="text-sm text-gray-500">{data.contractorLocation.split('-')[0].trim()}, {data.contractDate}.</p>
            </div>
            
            <p className="mb-8 font-bold text-xl uppercase tracking-widest text-center">{data.letterSubject}</p>

            <div className="whitespace-pre-wrap mb-8">
                {data.letterBody}
            </div>

            {data.coverLetterObjective && (
                <div className="my-8 p-6 bg-gray-50 border-l-4 border-gray-900 break-inside-avoid">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Objetivo Principal</p>
                     <p className="text-lg font-medium italic text-gray-800">"{data.coverLetterObjective}"</p>
                </div>
            )}

            {data.coverLetterCta && (
                <div className="mt-8 mb-12 font-bold text-center text-gray-900 break-inside-avoid">
                    <p>{data.coverLetterCta}</p>
                </div>
            )}

            <div className="mt-12">
                <p className="mb-4">Atenciosamente,</p>
                {data.contractorSignature && <img src={data.contractorSignature} alt="Signature" className="h-16 mb-2 object-contain -ml-2" />}
                <div className="font-bold uppercase tracking-wide">{data.contractorName}</div>
                <div className="text-sm text-gray-600">{data.contractorRole}</div>
            </div>
        </div>
      </>
  );

  const renderLetterhead = () => (
      <div className="flex flex-col h-full min-h-[297mm]">
          <div className="border-b-4 pb-8 mb-12 flex justify-between items-center" style={{ borderColor: data.accentColor }}>
              {data.contractorLogo && <img src={data.contractorLogo} alt="Logo" className="h-24 w-auto object-contain" />}
              <div className="text-right">
                  <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900 leading-none">{data.contractorName}</h1>
                  <p className="text-sm font-bold uppercase tracking-widest mt-2" style={{ color: data.accentColor }}>{data.contractorRole}</p>
              </div>
          </div>
          
          <div className="flex-1 font-serif text-[12pt] leading-relaxed text-gray-800 whitespace-pre-wrap">
              {data.letterBody || "Inicie seu texto aqui..."}
          </div>
          
          <div className="mt-auto pt-12 border-t flex justify-between items-end text-[10px] text-gray-400 uppercase tracking-widest" style={{ borderColor: `${data.accentColor}20` }}>
              <div>
                  <p className="font-bold text-gray-600 mb-1">Contato</p>
                  <p>{data.contractorContact}</p>
                  <p>{data.contractorLocation}</p>
              </div>
              <div>
                  <p className="font-bold text-gray-600 mb-1">Documentação</p>
                  <p>{data.contractorDoc}</p>
              </div>
              {data.contractorSignature && (
                  <img src={data.contractorSignature} alt="Signature" className="h-12 object-contain grayscale opacity-50" />
              )}
          </div>
      </div>
  );

  const renderLetterOrDeclaration = () => (
      <>
        <Header />
        <div className="mt-16 text-justify font-serif text-[11pt] leading-loose text-gray-900">
            <p className="text-right mb-16">{data.contractorLocation.split('-')[0].trim()}, {data.contractDate}.</p>
            
            <p className="mb-8 font-bold text-xl uppercase tracking-widest text-center">{data.letterSubject}</p>

            <div className="whitespace-pre-wrap min-h-[300px]">
                {data.letterBody}
            </div>

            <div className="mt-24">
                <p className="mb-4">Atenciosamente,</p>
                {data.contractorSignature && <img src={data.contractorSignature} alt="Signature" className="h-16 mb-2 object-contain -ml-2" />}
                <div className="font-bold uppercase tracking-wide">{data.contractorName}</div>
                <div className="text-sm text-gray-600">{data.contractorRole}</div>
            </div>
        </div>
      </>
  );

  return (
    <div className="flex flex-col h-full bg-[#111827]">
        {/* Toolbar */}
        <div className="flex justify-between items-center px-6 py-4 bg-[#0B0F19] border-b border-slate-800 shrink-0 shadow-lg z-20">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${data.status === 'final' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : data.status === 'pending' ? 'bg-amber-500' : 'bg-slate-500'}`} />
                <span className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                    {data.type} &middot; {data.status}
                </span>
            </div>
            
            <div className="flex items-center gap-4">
                {/* Visual Options */}
                <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
                    <button 
                        onClick={() => setIsPrintMode(!isPrintMode)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${isPrintMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        {isPrintMode ? <EyeOff size={14} /> : <Eye size={14} />}
                        {isPrintMode ? 'MODO FOCO' : 'VER PAPEL'}
                    </button>
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold rounded-lg text-slate-400 hover:text-slate-200 transition-all"
                    >
                        {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        {copied ? 'COPIADO' : 'COPIAR'}
                    </button>
                </div>

                <div className="h-6 w-px bg-slate-800 mx-1"></div>

                {/* Export Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
                    >
                        <Printer size={14} /> IMPRIMIR
                    </button>
                    <button 
                        onClick={handleDownloadPDF} 
                        disabled={isDownloading} 
                        className="flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20"
                        style={{ backgroundColor: data.accentColor }}
                    >
                        {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        {isDownloading ? 'GERANDO...' : 'BAIXAR PDF'}
                    </button>
                </div>
            </div>
        </div>

        {/* Workspace Area */}
        <div className={`flex-1 overflow-y-auto p-4 md:p-16 transition-all duration-500 flex justify-center items-start custom-scrollbar relative ${isPrintMode ? 'bg-slate-200' : 'bg-[#020617]'}`}>
             {!isPrintMode && (
                <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
             )}

            <div 
                id="printable-content" 
                className={`bg-white text-black shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] origin-top transition-transform duration-500 relative ${isPrintMode ? 'scale-100' : 'scale-[0.85] sm:scale-100'}`}
                style={{
                    width: '210mm',
                    minHeight: '297mm',
                    display: 'block',
                    boxSizing: 'border-box'
                }}
            >
                {/* Page Break Simulation Lines (only in preview) */}
                {!isPrintMode && (
                    <div className="absolute inset-0 pointer-events-none z-50">
                        <div className="h-[297mm] border-b-2 border-dashed border-indigo-500/10 w-full relative">
                            <span className="absolute bottom-1 right-2 text-[8px] font-black text-indigo-500/20 uppercase tracking-widest">Fim da Página 1</span>
                        </div>
                        <div className="h-[297mm] border-b-2 border-dashed border-indigo-500/10 w-full relative">
                            <span className="absolute bottom-1 right-2 text-[8px] font-black text-indigo-500/20 uppercase tracking-widest">Fim da Página 2</span>
                        </div>
                        <div className="h-[297mm] border-b-2 border-dashed border-indigo-500/10 w-full relative">
                            <span className="absolute bottom-1 right-2 text-[8px] font-black text-indigo-500/20 uppercase tracking-widest">Fim da Página 3</span>
                        </div>
                    </div>
                )}
                <div style={{
                    paddingTop: '25mm',
                    paddingBottom: '20mm',
                    paddingLeft: '30mm',
                    paddingRight: '20mm',
                    minHeight: '297mm',
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box'
                }}>
                    <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
                        {/* RASCUNHO — faint diagonal watermark */}
                        {data.status === 'draft' && (
                            <p style={{
                                fontSize: '100pt', fontWeight: 900, textTransform: 'uppercase',
                                transform: 'rotate(-40deg)', color: 'rgba(156,163,175,0.08)',
                                letterSpacing: '0.1em', userSelect: 'none', whiteSpace: 'nowrap',
                            }}>RASCUNHO</p>
                        )}
                        {/* EM REVISÃO — amber dashed circle stamp */}
                        {data.status === 'pending' && (
                            <div style={{
                                transform: 'rotate(-15deg)',
                                border: '4pt double rgba(245,158,11,0.2)',
                                borderRadius: '50%', padding: '15mm',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                outline: '2pt solid rgba(245,158,11,0.1)', outlineOffset: '2mm'
                            }}>
                                <p style={{
                                    fontSize: '28pt', fontWeight: 900, textTransform: 'uppercase',
                                    color: 'rgba(245,158,11,0.2)', letterSpacing: '0.1em',
                                    userSelect: 'none', whiteSpace: 'nowrap', margin: 0
                                }}>REVISÃO</p>
                                <p style={{
                                    fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase',
                                    color: 'rgba(245,158,11,0.15)', letterSpacing: '0.2em',
                                    userSelect: 'none', whiteSpace: 'nowrap', margin: 0
                                }}>TÉCNICA</p>
                            </div>
                        )}
                        {/* FINALIZADO — Documento limpo e oficial (no watermark) */}
                        {data.status === 'final' && null}
                        {/* PAGO — bold emerald rectangle stamp */}
                        {data.status === 'paid' && (
                            <div style={{
                                transform: 'rotate(-10deg)',
                                border: '6pt double rgba(16,185,129,0.25)',
                                borderRadius: '2mm', padding: '5mm 12mm',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <p style={{
                                    fontSize: '60pt', fontWeight: 950, textTransform: 'uppercase',
                                    color: 'rgba(16,185,129,0.25)', letterSpacing: '0.05em',
                                    userSelect: 'none', whiteSpace: 'nowrap',
                                }}>PAGO</p>
                            </div>
                        )}
                    </div>

                    <div className="relative z-10 flex-1">
                        {(data.type === 'contract' || data.type === 'nda') && renderContract()}
                        {(data.type === 'quote' || data.type === 'invoice') && renderQuoteOrInvoice()}
                        {data.type === 'cv' && renderCV()}
                        {(data.type === 'letter' || data.type === 'declaration') && renderLetterOrDeclaration()}
                        {data.type === 'letterhead' && renderLetterhead()}
                        {data.type === 'coverLetter' && renderCoverLetter()}
                    </div>
                    
                    <div className="mt-12 pt-4 border-t border-gray-100 flex justify-between items-center opacity-30 text-[7pt] font-bold uppercase tracking-widest text-gray-400 break-inside-avoid">
                        <p>Documento Gerado via paper-contracts &middot; ISO 216</p>
                        <p>Thomas Eduardo <span style={{ color: data.accentColor }}>@devthomas</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
