<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="EditOrderPayments.ascx.cs" Inherits="UCommerce.Web.UI.Orders.EditOrderPayments" %>

<asp:Repeater runat="server" ID="PaymentRepeater" DataSource="<%# Payments %>">
	<ItemTemplate>
		<div class="orderPayment-<%# Container.ItemIndex % 2 == 0 ? "even" : "odd"%>">
			<div class="propertyPane leftAligned shippingPane" style="overflow: hidden;">

                <h2 class="propertyPaneTitel">Payment  #<%#Container.ItemIndex+1%></h2>
			    <commerce:PropertyPanel runat="server" meta:resourceKey="PaymentMethod">
				    <%# AsPayment(Container.DataItem).PaymentMethodName %>
			    </commerce:PropertyPanel> 
			    <commerce:PropertyPanel runat="server" meta:resourceKey="Amount">
				    <%# AsPayment(Container.DataItem).Amount.ToString("N") %>
			    </commerce:PropertyPanel>
			    <commerce:PropertyPanel runat="server" meta:resourceKey="PaymentStatus">
				    <%# AsPaymentStatus(Container.DataItem).Name %>
			    </commerce:PropertyPanel>
			    <commerce:PropertyPanel runat="server" meta:resourceKey="TransactionID">
				    <%# AsPayment(Container.DataItem).TransactionId %>
			    </commerce:PropertyPanel>
			    <commerce:PropertyPanel runat="server" meta:resourceKey="ReferenceID">
				    <%# AsPayment(Container.DataItem).ReferenceId %>
			    </commerce:PropertyPanel>
            </div>
		</div>
	</ItemTemplate>
</asp:Repeater>