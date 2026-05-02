import React, { useState } from 'react';
import { Printer, Copy, CheckCircle2, Download, Loader2, Eye, EyeOff, Trash2 } from 'lucide-react';

export const ContractPreview = ({ data, onChange }) => {
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
        <div className="text-gray-900 bg-white">
            {/* Corporate Header */}
            <div className="flex justify-between items-start mb-12 border-b border-gray-900 pb-8">
                <div className="flex items-start gap-6">
                    {data.contractorLogo && <img src={data.contractorLogo} alt="Logo" className="h-16 w-auto object-contain" />}
                    <div>
                        <h1 className="text-3xl font-light tracking-tight uppercase text-gray-900">{isInvoice ? 'Fatura de Serviço' : 'Proposta Comercial'}</h1>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">Doc Ref: {isInvoice ? `#${data.invoiceId || '001'}` : `${data.type.toUpperCase()}-001`}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="font-bold text-gray-900 text-sm uppercase tracking-widest">{data.contractorName}</h2>
                    <p className="text-xs text-gray-500 mt-1">{data.contractorDoc}</p>
                    <p className="text-xs text-gray-500">{data.contractorContact}</p>
                </div>
            </div>

            {/* Corporate Parties Block */}
            <div className="flex justify-between border-b border-gray-200 pb-10 mb-10 break-inside-avoid">
                <div className="w-1/2 pr-8">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Emitido Para (Cliente)</p>
                    <p className="font-bold text-base text-gray-900 uppercase">{data.clientName}</p>
                    <p className="text-xs text-gray-600 mt-1">{data.clientDoc}</p>
                    <p className="text-xs text-gray-600 mt-1">{data.clientAddress}</p>
                </div>
                <div className="w-1/2 pl-8 border-l border-gray-200">
                    <div className="flex justify-between mb-4">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Data de Emissão</p>
                        <p className="font-bold text-sm text-gray-900">{isInvoice ? data.invoiceIssueDate : data.contractDate}</p>
                    </div>
                    <div className="flex justify-between">
                         {isInvoice ? (
                            <>
                               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
                               <p className={`font-bold text-sm uppercase tracking-widest ${data.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                  {data.status === 'paid' ? 'Liquidado' : 'Em Aberto'}
                               </p>
                            </>
                         ) : (
                             <>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Validade da Proposta</p>
                                <p className="font-bold text-sm text-gray-900">{data.quoteValidUntil}</p>
                             </>
                         )}
                    </div>
                </div>
            </div>

            {/* Corporate Table */}
            <table className="w-full mb-12 border-collapse">
                <thead>
                    <tr className="border-y-2 border-gray-900">
                        <th className="text-left py-3 px-2 font-bold uppercase text-[10px] tracking-widest text-gray-900">Descrição do Escopo</th>
                        <th className="text-center py-3 px-2 font-bold uppercase text-[10px] tracking-widest text-gray-900 w-24">Qtd</th>
                        <th className="text-right py-3 px-2 font-bold uppercase text-[10px] tracking-widest text-gray-900 w-32">Valor Unit.</th>
                        <th className="text-right py-3 px-2 font-bold uppercase text-[10px] tracking-widest text-gray-900 w-32">Subtotal</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.quoteItems.map((item) => (
                        <tr key={item.id}>
                            <td className="py-4 px-2 text-sm text-gray-800">{item.description}</td>
                            <td className="text-center py-4 px-2 text-sm text-gray-600">{item.quantity}</td>
                            <td className="text-right py-4 px-2 text-sm text-gray-600">{formatCurrency(item.unitPrice)}</td>
                            <td className="text-right py-4 px-2 text-sm font-bold text-gray-900">{formatCurrency(item.quantity * item.unitPrice)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={2} className="border-t-2 border-gray-900"></td>
                        <td className="text-right py-4 px-2 font-bold text-xs uppercase tracking-widest text-gray-900 border-t-2 border-gray-900">Total Devido</td>
                        <td className="text-right py-4 px-2 font-bold text-lg text-gray-900 border-t-2 border-gray-900">{formatCurrency(total)}</td>
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
                <div className="mt-12 pt-8 border-t border-gray-200 flex items-start justify-between break-inside-avoid">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-2">Dados Bancários / PIX</p>
                        <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                            O pagamento deve ser realizado através da chave PIX abaixo. Solicitamos o envio do comprovante para o nosso e-mail de contato.
                        </p>
                        <div className="mt-4 inline-flex items-center gap-4 border border-gray-300 py-2 px-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">CHAVE</span>
                            <span className="text-sm font-bold text-gray-900">{data.pixKey}</span>
                        </div>
                    </div>
                    <div className="border border-gray-200 p-1">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(data.pixKey)}`} 
                            alt="QR Code Pix" 
                            className="w-24 h-24"
                        />
                    </div>
                </div>
            )}
            
            <div className="mt-16 pt-12 border-t border-gray-200 flex justify-between items-end break-inside-avoid">
                 <div>
                     <div className="w-64 h-px bg-gray-400 mb-3 relative">
                         {isInvoice && data.contractorSignature && <img src={data.contractorSignature} className="absolute bottom-0 left-1/2 -translate-x-1/2 h-16 object-contain" />}
                     </div>
                     <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">{isInvoice ? data.contractorName : 'Assinatura do Responsável'}</p>
                     <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">{isInvoice ? 'Emissor' : 'Aprovador'}</p>
                 </div>
                 
                 <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Documento Gerado Em</p>
                    <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mt-1">{new Date().toLocaleDateString('pt-BR')} - PAPER CONTRACTS V3</p>
                 </div>
            </div>
        </div>
    );
  };

  const renderCV = () => (
      <div className="text-gray-900 bg-white">
          {/* === HEADER === */}
          <header className="border-b border-gray-200 pb-10 mb-10">
              <div className="flex justify-between items-center">
                  <div>
                      <h1 className="text-4xl font-light tracking-tight leading-none m-0">
                          {data.contractorName}
                      </h1>
                      <p className="text-lg font-bold text-gray-500 mt-2 uppercase tracking-widest">
                          {data.contractorRole}
                      </p>
                  </div>
                  {data.contractorLogo && (
                      <img src={data.contractorLogo} alt="Logo" className="h-20 w-20 object-cover rounded-full border-2 border-gray-100" />
                  )}
              </div>

              {/* Contact Information */}
              <div className="flex flex-wrap gap-x-8 gap-y-2 mt-8 text-[10pt] font-medium text-gray-400">
                  {[
                      { val: data.contractorContact, label: 'Tel' },
                      { val: data.contractorLocation, label: 'Loc' },
                      { val: data.contractorDoc, label: 'Doc' },
                      { val: data.contractorLinkedin, label: 'LinkedIn' },
                      { val: data.contractorGithub, label: 'GitHub' },
                      { val: data.contractorPortfolio, label: 'Portfólio' },
                  ].filter(i => i.val).map((item, i) => (
                      <span key={i} className="flex items-center gap-2">
                          <span className="text-gray-900 font-bold uppercase text-[7pt] tracking-widest">{item.label}:</span>
                          <span className="text-gray-600">{item.val}</span>
                      </span>
                  ))}
              </div>
          </header>

          {/* === CONTENT STACK (SINGLE COLUMN) === */}
          <div className="space-y-12">
              
              {/* Summary */}
              {data.cvSummary && (
                  <section className="break-inside-avoid">
                      <h2 className="text-[9pt] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-100 pb-2">
                          {data.language === 'en' ? 'Professional Summary' : 'Resumo Profissional'}
                      </h2>
                      <p className="text-[11pt] leading-relaxed text-gray-700 font-medium">
                          {data.cvSummary}
                      </p>
                  </section>
              )}

              {/* Skills - Now full width and prominent */}
              {data.cvSkills && data.cvSkills.length > 0 && (
                  <section className="break-inside-avoid">
                      <h2 className="text-[9pt] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-100 pb-2">
                          {data.language === 'en' ? 'Skills & Technologies' : 'Competências & Tecnologias'}
                      </h2>
                      <p className="text-[10pt] leading-loose text-gray-800 font-bold">
                          {data.cvSkills.join('  ·  ')}
                      </p>
                  </section>
              )}

              {/* Experience */}
              {data.cvExperience && (
                  <section>
                      <h2 className="text-[9pt] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 border-b border-gray-100 pb-2">
                          {data.language === 'en' ? 'Work History' : 'Experiência Profissional'}
                      </h2>
                      <div className="text-[10.5pt] leading-relaxed text-gray-800 whitespace-pre-line">
                          {data.cvExperience}
                      </div>
                  </section>
              )}

              {/* Education */}
              {data.cvEducation && (
                  <section className="break-inside-avoid">
                      <h2 className="text-[9pt] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-100 pb-2">
                          {data.language === 'en' ? 'Education' : 'Educação'}
                      </h2>
                      <div className="text-[10pt] leading-relaxed text-gray-700 whitespace-pre-line font-medium">
                          {data.cvEducation}
                      </div>
                  </section>
              )}

              {/* Projects / Additional Info */}
              {data.cvProjects && (
                  <section className="break-inside-avoid">
                      <h2 className="text-[9pt] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-100 pb-2">
                          {data.language === 'en' ? 'Projects & Additional Information' : 'Projetos & Informações Adicionais'}
                      </h2>
                      <div className="text-[10pt] leading-relaxed text-gray-800 whitespace-pre-line">
                          {data.cvProjects}
                      </div>
                  </section>
              )}

          </div>
      </div>
  );

  const renderCoverLetter = () => (
      <div className="text-gray-900 bg-white">
          {/* === COVER LETTER HEADER === */}
          <div className="border-b border-gray-200 pb-10 mb-12 flex justify-between items-end">
              <div>
                  <h1 className="text-4xl font-light tracking-tight leading-none m-0 text-gray-900">
                      {data.contractorName}
                  </h1>
                  <p className="text-sm font-medium text-gray-500 mt-3 uppercase tracking-widest">
                      {data.contractorRole}
                  </p>
              </div>
              <div className="text-right">
                  <p className="text-[10pt] font-bold text-black uppercase tracking-widest">{data.contractorLocation.split('-')[0].trim()}</p>
                  <p className="text-[9pt] font-bold text-gray-400 uppercase mt-1">{data.contractDate || new Date().toLocaleDateString('pt-BR')}</p>
              </div>
          </div>

          {/* RECIPIENT */}
          <div className="mb-16">
              <p className="text-[9pt] font-bold text-gray-300 uppercase tracking-[0.3em] mb-2">Destinatário</p>
              <p className="text-2xl font-bold tracking-tight">{data.clientName || 'Ao Gestor de Contratação'}</p>
              <p className="text-sm text-gray-500 mt-1 uppercase font-bold tracking-widest">Processo Seletivo / Proposta Estratégica</p>
          </div>

          {/* SUBJECT */}
          <div className="mb-12">
              <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900">
                  {data.letterSubject || 'Apresentação Profissional'}
              </h2>
          </div>

          {/* BODY */}
          <div className="text-[11.5pt] leading-loose text-gray-800 whitespace-pre-wrap mb-16 text-justify px-2">
              {data.letterBody || "Inicie sua apresentação aqui..."}
          </div>

          {/* HIGHLIGHT OBJECTIVE */}
          {data.coverLetterObjective && (
              <div className="my-16 py-8 px-10 bg-white border border-gray-200 break-inside-avoid relative group rounded-sm shadow-sm">
                   <p className="text-[8pt] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Foco Estratégico</p>
                   <p className="text-xl font-medium italic text-gray-800 leading-relaxed">
                       "{data.coverLetterObjective}"
                   </p>
              </div>
          )}

          {/* SIGNATURE AREA */}
          <div className="mt-20 pt-10 border-t border-gray-100 flex justify-between items-start">
              <div>
                  <p className="text-sm text-gray-500 mb-8 font-medium italic">Atenciosamente,</p>
                  {data.contractorSignature && (
                      <img src={data.contractorSignature} alt="Signature" className="h-16 mb-4 object-contain -ml-2 opacity-80" />
                  )}
                  <div className="text-lg font-bold tracking-tight text-gray-900">{data.contractorName}</div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-1">Engenharia & Soluções</div>
              </div>

              {data.coverLetterCta && (
                  <div className="max-w-[280px] bg-gray-50 p-6 rounded-sm border border-gray-200">
                      <p className="text-[7pt] font-bold uppercase tracking-widest text-gray-400 mb-2">Chamada para Ação</p>
                      <p className="text-xs font-medium leading-relaxed text-gray-700">
                          {data.coverLetterCta}
                      </p>
                  </div>
              )}
          </div>
      </div>
  );

  const renderLetterhead = () => (
      <div className="flex flex-col h-full min-h-[297mm]">
          <div className="border-b pb-8 mb-12 flex justify-between items-center" style={{ borderColor: `${data.accentColor}30` }}>
              {data.contractorLogo && <img src={data.contractorLogo} alt="Logo" className="h-24 w-auto object-contain" />}
              <div className="text-right">
                  <h1 className="text-2xl font-light tracking-tight text-gray-900 leading-none">{data.contractorName}</h1>
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
    <div className="flex flex-col h-full bg-midnight print:bg-white">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 sm:px-8 py-4 bg-midnight-lighter/50 backdrop-blur-xl border-b border-white/5 shrink-0 z-20 print:hidden">
            <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${data.status === 'final' ? 'bg-azure shadow-[0_0_12px_rgba(59,130,246,0.6)]' : data.status === 'pending' ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]' : 'bg-slate-600'}`} />
                <div className="flex flex-col">
                    <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
                        {data.type}
                    </span>
                    <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-0.5">
                        {data.status === 'final' ? 'Documento Pronto' : data.status === 'pending' ? 'Sob Revisão' : 'Rascunho Local'}
                    </span>
                </div>
            </div>
            
            <div className="flex flex-wrap items-center w-full md:w-auto gap-3 sm:gap-6">
                {/* TYPOGRAPHY & LANGUAGE ENGINE */}
                <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/5">
                    {[
                        { id: 'modern', label: 'MODERNO SANS' },
                        { id: 'serif', label: 'EDITORIAL SERIF' },
                        { id: 'mono', label: 'TÉCNICO MONO' }
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => onChange({ typographyStyle: t.id })}
                            className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-xl transition-all ${data.typographyStyle === t.id ? 'bg-white/10 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                    
                    {data.type === 'cv' && (
                        <>
                            <div className="w-px h-4 bg-white/10 mx-1"></div>
                            {[
                                { id: 'pt', label: 'PT' },
                                { id: 'en', label: 'EN' }
                            ].map(l => (
                                <button
                                    key={l.id}
                                    onClick={() => onChange({ language: l.id })}
                                    className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-xl transition-all ${data.language === l.id ? 'bg-azure/20 text-azure border border-azure/30 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-slate-600 hover:text-slate-400'}`}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </>
                    )}
                </div>

                {/* Visual Options */}
                <div className="flex items-center gap-1 sm:gap-3 bg-white/[0.03] p-1 rounded-2xl border border-white/5">
                    <button 
                        onClick={() => setIsPrintMode(!isPrintMode)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isPrintMode ? 'bg-azure text-white' : 'text-slate-500 hover:text-white'}`}
                    >
                        {isPrintMode ? 'SAIR DO FOCO' : 'MODO DE FOCO'}
                    </button>
                    <div className="w-px h-4 bg-white/10"></div>
                    <button 
                        onClick={handleCopy}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl text-slate-500 hover:text-white transition-all flex items-center gap-2"
                    >
                        {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        {copied ? 'COPIADO' : 'COPIAR TEXTO'}
                    </button>
                </div>

                {/* Export Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={handlePrint}
                        className="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-slate-300 transition-all border border-white/10"
                    >
                        IMPRIMIR
                    </button>
                    <button 
                        onClick={handleDownloadPDF} 
                        disabled={isDownloading} 
                        className="px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-white shadow-xl shadow-azure/20 active:scale-95 disabled:opacity-50"
                        style={{ backgroundColor: data.accentColor || '#3b82f6' }}
                    >
                        {isDownloading ? 'EXPORTANDO...' : 'EXPORTAR PDF'}
                    </button>
                </div>
            </div>
        </div>

        {/* Workspace Area */}
        <div className={`flex-1 overflow-y-auto p-4 md:p-20 transition-all duration-500 flex justify-center items-start custom-scrollbar relative print:overflow-visible print:p-0 print:bg-white print:block ${isPrintMode ? 'bg-slate-100' : 'bg-midnight-deep'}`}>
             {!isPrintMode && (
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] print:hidden" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
             )}

            <div 
                id="printable-content" 
                className={`bg-white text-black shadow-premium origin-top transition-all duration-700 relative w-[210mm] min-h-[297mm] print:w-full print:min-h-0 print:m-0 print:shadow-none print:scale-100 ${
                    data.typographyStyle === 'serif' ? 'font-serif' : 
                    data.typographyStyle === 'mono' ? 'font-mono' : 
                    'font-sans'
                } ${isPrintMode ? 'scale-100' : 'scale-[0.9] sm:scale-100 mt-8 mb-20'}`}
                style={{
                    display: 'block',
                    boxSizing: 'border-box'
                }}
            >
                {/* Page Break Simulation Lines (only in preview) */}
                {!isPrintMode && (
                    <div className="absolute inset-0 pointer-events-none z-50 print:hidden">
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
                <div 
                    className="min-h-[297mm] flex flex-col print:min-h-0 print:!p-0"
                    style={{
                        paddingTop: '25mm',
                        paddingBottom: '20mm',
                        paddingLeft: '30mm',
                        paddingRight: '20mm',
                        boxSizing: 'border-box'
                    }}
                >
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
