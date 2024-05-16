<script type="text/html" id="tmpl-fl-row-overlay">
	<div class="fl-row-overlay fl-block-overlay<# if ( data.global ) { #> fl-block-overlay-global<# } #>">
		<div class="fl-block-overlay-header">
			<div class="fl-block-overlay-actions">
				<# if ( data.global && ! FLBuilderConfig.userCanEditGlobalTemplates ) { #>
					<i class="fas fa-lock fl-tip" title="<?php _e( 'Locked', 'fl-builder' ); ?>"></i>
				<# } else { #>

					<# if ( 'row' !== FLBuilderConfig.userTemplateType && ! FLBuilderConfig.simpleUi ) { #>
						<span class="fl-builder-has-submenu fl-builder-submenu-hover">
							<svg class="fl-block-move fl-tip" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" title="<?php _e( 'Move', 'fl-builder' ); ?>">
								<path d="M1.29977 10.6381C0.883609 10.2612 0.914435 9.70728 1.30747 9.35342L3.7736 7.09948C4.3593 6.56099 5.07602 6.9764 5.07602 7.68412V9.18418H9.18366V5.06862H7.68087C6.97186 5.06862 6.5557 4.34551 7.08746 3.76856L9.35321 1.30692C9.71542 0.914591 10.2626 0.88382 10.6402 1.29922L12.906 3.76087C13.4454 4.3532 13.0293 5.06862 12.3126 5.06862H10.8252V9.18418H14.9251V7.68412C14.9251 6.9764 15.6418 6.56099 16.2275 7.09948L18.6937 9.36112C19.1021 9.72267 19.1021 10.2765 18.6937 10.6381L16.2352 12.8997C15.6418 13.4459 14.9251 13.0228 14.9251 12.3074V10.8227H10.8252V14.9306H12.3126C13.0293 14.9306 13.4454 15.646 12.906 16.2383L10.6402 18.7C10.278 19.1 9.72313 19.1 9.36092 18.7L7.08746 16.2306C6.5557 15.6537 6.97186 14.9306 7.68087 14.9306H9.18366V10.8227H5.07602V12.3074C5.07602 13.0228 4.3593 13.4459 3.76589 12.8997L1.29977 10.6381Z" fill="currentColor"/>
							</svg>
							<ul class="fl-builder-submenu fl-block-move-menu">
								<li>
									<a class="fl-builder-submenu-link fl-block-move-dir fl-block-move-up<# if ( data.isFirst ) { #> fl-builder-submenu-disabled<# } #>" href="javascript:void(0);">
										<?php _e( 'Move Up', 'fl-builder' ); ?>
									</a>
								</li>
								<li>
									<a class="fl-builder-submenu-link fl-block-move-dir fl-block-move-down<# if ( data.isLast ) { #> fl-builder-submenu-disabled<# } #>" href="javascript:void(0);">
										<?php _e( 'Move Down', 'fl-builder' ); ?>
									</a>
								</li>
							</ul>
						</span>
					<# } #>

					<span class="fl-builder-has-submenu fl-builder-submenu-hover">
						<i class="fl-block-settings fas fa-wrench fl-tip" title="<?php _e( 'Row Settings', 'fl-builder' ); ?><# if ( data.nodeLabel && ! FLBuilderConfig.node_labels_disabled ) { #>{{FLBuilderConfig.node_labels_separator}}{{data.nodeLabel}}<# } #>"></i>
						<?php if ( ! $simple_ui ) : ?>
							<# if ( ! data.global || ( data.global && 'row' == FLBuilderConfig.userTemplateType ) ) { #>
								<ul class="fl-builder-submenu">
									<li><a class="fl-builder-submenu-link fl-block-settings" href="javascript:void(0);"><?php _e( 'Row Settings', 'fl-builder' ); ?></a></li>
									<li><a class="fl-builder-submenu-link fl-block-col-reset" href="javascript:void(0);"><?php _e( 'Reset Column Widths', 'fl-builder' ); ?></a></li>
									<li><a class="fl-builder-submenu-link fl-block-row-reset" href="javascript:void(0);"><?php _e( 'Reset Row Width', 'fl-builder' ); ?></a></li>
									<li><a class="fl-builder-submenu-link fl-row-quick-copy" href="javascript:void(0);"><?php _e( 'Copy Row Settings', 'fl-builder' ); ?></a></li>
									<li><a class="fl-builder-submenu-link fl-row-quick-paste <# if ( 'row' === FLBuilderSettingsCopyPaste._getClipboardType() ) { #>fl-quick-paste-active<# } #>" href="javascript:void(0);"><?php _e( 'Paste Row Settings', 'fl-builder' ); ?></a></li>
								</ul>
							<# } #>
						<?php endif; ?>
					</span>

					<?php if ( ! FLBuilderModel::is_post_user_template( 'row' ) && ! $simple_ui ) : ?>
						<i class="fl-block-copy far fa-clone fl-tip" title="<?php _e( 'Duplicate', 'fl-builder' ); ?>"></i>
						<span class="fl-block-remove fl-tip" title="<?php _e( 'Remove', 'fl-builder' ); ?>">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path d="M16 4L4 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
								<path d="M4 4L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
							</svg>
						</span>
					<?php endif; ?>
				<# } #>
			</div>
			<div class="fl-clear"></div>
		</div>

		<# if ( data.nodeLabel && ! FLBuilderConfig.node_labels_disabled ) { #>
			<span class="fl-block-label<# if ( data.hasRules ) { #> fl-block-label-has-rules<# } #>">{{data.nodeLabel}}</span>
		<# } #>

		<# if ( data.hasRules ) { #>
			<i class="fas fa-eye fl-tip fl-block-has-rules {{data.rulesTypeRow}}" title="<?php _e( 'This row has visibility rules', 'fl-builder' ); ?>: {{data.rulesTextRow}}"></i>
		<# } #>
	</div>
</script>
<!-- #tmpl-fl-row-overlay -->

<script type="text/html" id="tmpl-fl-col-overlay">
	<div class="fl-col-overlay fl-block-overlay<# if ( data.global ) { #> fl-block-overlay-global<# } #>">
		<div class="fl-block-overlay-header">
			<div class="fl-block-overlay-actions">
				<# if ( data.global && ! FLBuilderConfig.userCanEditGlobalTemplates ) { #>
					<i class="fas fa-lock fl-tip" title="<?php _e( 'Locked', 'fl-builder' ); ?>"></i>
				<# } else { #>

					<# if ( 'column' !== FLBuilderConfig.userTemplateType && ! FLBuilderConfig.simpleUi ) { #>
						<span class="fl-builder-has-submenu fl-builder-submenu-hover">
							<svg class="fl-block-move fl-tip" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" title="<?php _e( 'Move', 'fl-builder' ); ?>">
								<path d="M1.29977 10.6381C0.883609 10.2612 0.914435 9.70728 1.30747 9.35342L3.7736 7.09948C4.3593 6.56099 5.07602 6.9764 5.07602 7.68412V9.18418H9.18366V5.06862H7.68087C6.97186 5.06862 6.5557 4.34551 7.08746 3.76856L9.35321 1.30692C9.71542 0.914591 10.2626 0.88382 10.6402 1.29922L12.906 3.76087C13.4454 4.3532 13.0293 5.06862 12.3126 5.06862H10.8252V9.18418H14.9251V7.68412C14.9251 6.9764 15.6418 6.56099 16.2275 7.09948L18.6937 9.36112C19.1021 9.72267 19.1021 10.2765 18.6937 10.6381L16.2352 12.8997C15.6418 13.4459 14.9251 13.0228 14.9251 12.3074V10.8227H10.8252V14.9306H12.3126C13.0293 14.9306 13.4454 15.646 12.906 16.2383L10.6402 18.7C10.278 19.1 9.72313 19.1 9.36092 18.7L7.08746 16.2306C6.5557 15.6537 6.97186 14.9306 7.68087 14.9306H9.18366V10.8227H5.07602V12.3074C5.07602 13.0228 4.3593 13.4459 3.76589 12.8997L1.29977 10.6381Z" fill="currentColor"/>
							</svg>
							<ul class="fl-builder-submenu fl-block-move-menu">
								<li>
									<a class="fl-builder-submenu-link fl-block-move-dir fl-block-move-up<# if ( data.isFirst ) { #> fl-builder-submenu-disabled<# } #>" href="javascript:void(0);">
										<?php _e( 'Move Left', 'fl-builder' ); ?>
									</a>
								</li>
								<li>
									<a class="fl-builder-submenu-link fl-block-move-dir fl-block-move-down<# if ( data.isLast ) { #> fl-builder-submenu-disabled<# } #>" href="javascript:void(0);">
										<?php _e( 'Move Right', 'fl-builder' ); ?>
									</a>
								</li>
							</ul>
						</span>
					<# } #>

					<span class="fl-builder-has-submenu fl-builder-submenu-hover">
						<i class="fl-block-settings fas fa-wrench fl-tip" title="<?php _e( 'Column Settings', 'fl-builder' ); ?><# if ( data.nodeLabel && ! FLBuilderConfig.node_labels_disabled ) { #>{{FLBuilderConfig.node_labels_separator}}{{data.nodeLabel}}<# } #>"></i>
						<?php if ( ! $simple_ui ) : ?>
							<# if ( ! data.global || ( data.global && FLBuilderConfig.userTemplateType ) ) { #>
								<ul class="fl-builder-submenu fl-block-col-submenu">
									<li><a class="fl-builder-submenu-link fl-block-settings" href="javascript:void(0);"><?php _e( 'Column Settings', 'fl-builder' ); ?></a></li>
									<# if ( data.numCols > 1 || ( data.hasParentCol && data.numParentCols > 1 ) ) { #>
										<li><a class="fl-builder-submenu-link fl-block-col-reset" href="javascript:void(0);"><?php _e( 'Reset Column Widths', 'fl-builder' ); ?></a></li>
									<# } #>
									<# if ( data.rowIsFixedWidth ) { #>
										<li><a class="fl-builder-submenu-link fl-block-row-reset" href="javascript:void(0);"><?php _e( 'Reset Row Width', 'fl-builder' ); ?></a></li>
									<# } #>
									<li><a class="fl-builder-submenu-link fl-col-quick-copy" href="javascript:void(0);"><?php _e( 'Copy Column Settings', 'fl-builder' ); ?></a></li>
									<li><a class="fl-builder-submenu-link fl-col-quick-paste <# if ( 'column' === FLBuilderSettingsCopyPaste._getClipboardType() ) { #>fl-quick-paste-active<# } #>" href="javascript:void(0);"><?php _e( 'Paste Column Settings', 'fl-builder' ); ?></a></li>
								</ul>
							<# } #>
						<?php endif; ?>
					</span>

					<?php if ( ! $simple_ui ) : ?>
						<# if ( ! data.isRootCol ) { #>
							<# if ( ( ! data.hasParentCol && data.numCols < 12 ) || ( data.hasParentCol && data.numCols < 4 ) ) { #>
								<i class="fl-block-copy fl-block-col-copy far fa-clone fl-tip" title="<?php _e( 'Duplicate', 'fl-builder' ); ?>"></i>
							<# } #>
							<# if ( data.parentMenu ) { #>
								<span class="fl-builder-has-submenu fl-builder-submenu-hover">
									<svg width="20" height="20" class="fl-block-select-parent fl-tip" title="<?php _e( 'Select Parent', 'fl-builder' ); ?>">
										<path d="M1.38672 5.33984C2.1582 5.33984 2.77344 4.72461 2.77344 3.95312C2.77344 3.19141 2.1582 2.56641 1.38672 2.56641C0.625 2.56641 0 3.19141 0 3.95312C0 4.72461 0.625 5.33984 1.38672 5.33984ZM5.97656 4.89062H14.0565C14.5838 4.89062 15.0038 4.48047 15.0038 3.95312C15.0038 3.42578 14.5936 3.01562 14.0565 3.01562H5.97656C5.45898 3.01562 5.03906 3.42578 5.03906 3.95312C5.03906 4.48047 5.44922 4.89062 5.97656 4.89062ZM3.88672 11.3457C4.64844 11.3457 5.27344 10.7305 5.27344 9.95898C5.27344 9.19727 4.64844 8.57227 3.88672 8.57227C3.11523 8.57227 2.49023 9.19727 2.49023 9.95898C2.49023 10.7305 3.11523 11.3457 3.88672 11.3457ZM8.47656 10.8965H16.5794C17.1068 10.8965 17.5169 10.4863 17.5169 9.95898C17.5169 9.43164 17.1068 9.02148 16.5794 9.02148H8.47656C7.94922 9.02148 7.53906 9.43164 7.53906 9.95898C7.53906 10.4863 7.94922 10.8965 8.47656 10.8965ZM6.37695 17.3516C7.14844 17.3516 7.76367 16.7363 7.76367 15.9648C7.76367 15.2031 7.14844 14.5781 6.37695 14.5781C5.61523 14.5781 4.99023 15.2031 4.99023 15.9648C4.99023 16.7363 5.61523 17.3516 6.37695 17.3516ZM10.9668 16.9023H19.0251C19.5524 16.9023 19.9626 16.4922 19.9626 15.9648C19.9626 15.4375 19.5524 15.0273 19.0251 15.0273H10.9668C10.4395 15.0273 10.0293 15.4375 10.0293 15.9648C10.0293 16.4922 10.4395 16.9023 10.9668 16.9023Z" fill="currentColor"></path>
									</svg>
									<ul class="fl-builder-submenu fl-block-select-parent-menu">
										<# for( var i in data.parentMenu ) {
											var margin = i < 2 ? 0 : ( i * 12 ) - 12;
										#>
											<li class="fl-builder-has-submenu">
												<a href="javascript:void(0);" data-target-node="{{data.parentMenu[i].node}}" class="fl-builder-submenu-link">
													<span style="margin-left:{{margin}}px;">
														<# if ( i > 0 ) { #>
															<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="12px" width="12px">
																<path d="M5 6l5 5 5-5 2 1-7 7-7-7z"></path>
															</svg>
														<# } #>
														{{data.parentMenu[i].name}}
														<i class="fas fa-caret-right"></i>
													</span>
												</a>
												<ul class="fl-builder-submenu">
													<li>
														<a class="fl-builder-submenu-link fl-block-settings" data-target-node="{{data.parentMenu[i].node}}" href="javascript:void(0);">
															<?php /* translators: %s: Node type */ ?>
															<?php printf( __( '%s Settings', 'fl-builder' ), '{{data.parentMenu[i].name}}' ); ?>
														</a>
													</li>
													<li>
														<a class="fl-builder-submenu-link fl-{{data.parentMenu[i].type}}-move" data-target-node="{{data.parentMenu[i].node}}" href="javascript:void(0);">
															<?php /* translators: %s: Node type */ ?>
															<?php printf( __( 'Move %s', 'fl-builder' ), '{{data.parentMenu[i].name}}' ); ?>
														</a>
													</li>
													<li>
														<a class="fl-builder-submenu-link fl-block-copy" data-target-node="{{data.parentMenu[i].node}}" href="javascript:void(0);">
															<?php /* translators: %s: Node type */ ?>
															<?php printf( __( 'Duplicate %s', 'fl-builder' ), '{{data.parentMenu[i].name}}' ); ?>
														</a>
													</li>
													<li>
														<a class="fl-builder-submenu-link fl-block-remove" data-target-node="{{data.parentMenu[i].node}}" href="javascript:void(0);">
															<?php /* translators: %s: Node type */ ?>
															<?php printf( __( 'Remove %s', 'fl-builder' ), '{{data.parentMenu[i].name}}' ); ?>
														</a>
													</li>
												</ul>
											</li>
										<# } #>
									</ul>
								</span>
							<# } #>
							<span class="fl-block-remove fl-tip" title="<?php _e( 'Remove', 'fl-builder' ); ?>">
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path d="M16 4L4 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
									<path d="M4 4L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
								</svg>
							</span>
						<# } #>
					<?php endif; ?>
				<# } #>
			</div>
			<div class="fl-clear"></div>
		</div>

		<# if ( data.nodeLabel && ! FLBuilderConfig.node_labels_disabled ) { #>
			<span class="fl-block-label<# if ( data.hasRules ) { #> fl-block-label-has-rules<# } #>">{{data.nodeLabel}}</span>
		<# } #>

		<# if ( data.hasRules ) { #>
			<i class="fas fa-eye fl-tip fl-block-has-rules" title="<?php _e( 'This column has visibility rules.', 'fl-builder' ); ?>"></i>
		<# } #>

		<?php if ( ! $simple_ui ) : ?>
			<# if ( ! data.groupLoading ) { #>
				<# if ( ! data.isFirst || ( data.hasParentCol && data.isFirst && ! data.parentFirst ) ) { #>
					<div class="fl-block-col-resize fl-block-col-resize-w<# if ( data.hasParentCol && data.isFirst && ! data.parentFirst ) { #> fl-block-col-resize-parent<# } #>">
						<div class="fl-block-col-resize-handle-wrap">
							<div class="fl-block-col-resize-feedback fl-block-col-resize-feedback-left"></div>
							<div class="fl-block-col-resize-handle"></div>
							<div class="fl-block-col-resize-feedback fl-block-col-resize-feedback-right"></div>
						</div>
					</div>
				<# } #>
				<# if ( ! data.isLast || ( data.hasParentCol && data.isLast && ! data.parentLast ) ) { #>
					<div class="fl-block-col-resize fl-block-col-resize-e<# if ( data.hasParentCol && data.isLast && ! data.parentLast ) { #> fl-block-col-resize-parent<# } #>">
						<div class="fl-block-col-resize-handle-wrap">
							<div class="fl-block-col-resize-feedback fl-block-col-resize-feedback-left"></div>
							<div class="fl-block-col-resize-handle"></div>
							<div class="fl-block-col-resize-feedback fl-block-col-resize-feedback-right"></div>
						</div>
					</div>
				<# } #>
			<# } #>
			<# if ( data.userCanResizeRows ) { #>
				<# if ( ( ( data.isFirst && ! data.hasParentCol ) || ( data.isFirst && data.parentFirst ) ) && data.rowIsFixedWidth ) { #>
					<div class="fl-block-row-resize fl-block-col-resize fl-block-col-resize-w">
						<div class="fl-block-col-resize-handle-wrap">
							<div class="fl-block-col-resize-feedback fl-block-col-resize-feedback-left"></div>
							<div class="fl-block-col-resize-handle"></div>
							<div class="fl-block-col-resize-feedback fl-block-col-resize-feedback-right"></div>
						</div>
					</div>
				<# } #>
				<# if ( ( ( data.isLast && ! data.hasParentCol ) || ( data.isLast && data.parentLast ) ) && data.rowIsFixedWidth ) { #>
					<div class=" fl-block-row-resize fl-block-col-resize fl-block-col-resize-e">
						<div class="fl-block-col-resize-handle-wrap">
							<div class="fl-block-col-resize-feedback fl-block-col-resize-feedback-left"></div>
							<div class="fl-block-col-resize-handle"></div>
							<div class="fl-block-col-resize-feedback fl-block-col-resize-feedback-right"></div>
						</div>
					</div>
				<# } #>
			<# } #>
		<?php endif; ?>
	</div>
</script>
<!-- #tmpl-fl-col-overlay -->

<script type="text/html" id="tmpl-fl-module-overlay">
	<div class="fl-module-overlay fl-block-overlay<# if ( data.global ) { #> fl-block-overlay-global<# } #>">
		<div class="fl-block-overlay-header">
			<div class="fl-block-overlay-actions">
				<# if ( data.global && ! FLBuilderConfig.userCanEditGlobalTemplates ) { #>
					<i class="fas fa-lock fl-tip" title="<?php _e( 'Locked', 'fl-builder' ); ?>"></i>
				<# } else { #>

					<# if ( ! data.isRootModule && ! FLBuilderConfig.simpleUi ) { #>
						<span class="fl-builder-has-submenu fl-builder-submenu-hover">
							<svg class="fl-block-move fl-tip" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" title="<?php _e( 'Move', 'fl-builder' ); ?>">
								<path d="M1.29977 10.6381C0.883609 10.2612 0.914435 9.70728 1.30747 9.35342L3.7736 7.09948C4.3593 6.56099 5.07602 6.9764 5.07602 7.68412V9.18418H9.18366V5.06862H7.68087C6.97186 5.06862 6.5557 4.34551 7.08746 3.76856L9.35321 1.30692C9.71542 0.914591 10.2626 0.88382 10.6402 1.29922L12.906 3.76087C13.4454 4.3532 13.0293 5.06862 12.3126 5.06862H10.8252V9.18418H14.9251V7.68412C14.9251 6.9764 15.6418 6.56099 16.2275 7.09948L18.6937 9.36112C19.1021 9.72267 19.1021 10.2765 18.6937 10.6381L16.2352 12.8997C15.6418 13.4459 14.9251 13.0228 14.9251 12.3074V10.8227H10.8252V14.9306H12.3126C13.0293 14.9306 13.4454 15.646 12.906 16.2383L10.6402 18.7C10.278 19.1 9.72313 19.1 9.36092 18.7L7.08746 16.2306C6.5557 15.6537 6.97186 14.9306 7.68087 14.9306H9.18366V10.8227H5.07602V12.3074C5.07602 13.0228 4.3593 13.4459 3.76589 12.8997L1.29977 10.6381Z" fill="currentColor"/>
							</svg>
							<ul class="fl-builder-submenu fl-block-move-menu">
								<li>
									<a class="fl-builder-submenu-link fl-block-move-dir fl-block-move-up<# if ( data.isFirst ) { #> fl-builder-submenu-disabled<# } #>" href="javascript:void(0);">
										<# if ( 'vertical' === data.layoutDirection ) { #>
											<?php _e( 'Move Up', 'fl-builder' ); ?>
										<# } else if ( 'layered' === data.layoutDirection ) { #>
											<?php _e( 'Move Back', 'fl-builder' ); ?>
										<# } else { #>
											<?php _e( 'Move Left', 'fl-builder' ); ?>
										<# } #>
									</a>
								</li>
								<li>
									<a class="fl-builder-submenu-link fl-block-move-dir fl-block-move-down<# if ( data.isLast ) { #> fl-builder-submenu-disabled<# } #>" href="javascript:void(0);">
										<# if ( 'vertical' === data.layoutDirection ) { #>
											<?php _e( 'Move Down', 'fl-builder' ); ?>
										<# } else if ( 'layered' === data.layoutDirection ) { #>
											<?php _e( 'Move Forward', 'fl-builder' ); ?>
										<# } else { #>
											<?php _e( 'Move Right', 'fl-builder' ); ?>
										<# } #>
									</a>
								</li>
							</ul>
						</span>
					<# } #>

					<span class="fl-builder-has-submenu fl-builder-submenu-hover">
						<?php /* translators: %s: module name */ ?>
						<i class="fl-block-settings fas fa-wrench fl-tip" title="<?php printf( __( '%s Settings', 'fl-builder' ), '{{data.moduleName}}' ); ?><# if ( data.nodeLabel && ! FLBuilderConfig.node_labels_disabled ) { #>{{FLBuilderConfig.node_labels_separator}}{{data.nodeLabel}}<# } #>"></i>
						<ul class="fl-builder-submenu">
							<?php /* translators: %s: module name */ ?>
							<li><a class="fl-builder-submenu-link fl-block-settings" href="javascript:void(0);"><?php printf( __( '%s Settings', 'fl-builder' ), '{{data.moduleName}}' ); ?></a></li>
							<?php /* translators: %s: module name */ ?>
							<li><a class="fl-builder-submenu-link fl-module-quick-copy" href="javascript:void(0);"><?php printf( __( 'Copy %s Settings', 'fl-builder' ), '{{data.moduleName}}' ); ?></a></li>
							<?php /* translators: %s: module name */ ?>
							<li><a class="fl-builder-submenu-link fl-module-quick-paste <# if ( data.moduleType === FLBuilderSettingsCopyPaste._getClipboardType() ) { #>fl-quick-paste-active<# } #>" href="javascript:void(0);"><?php printf( __( 'Paste %s Settings', 'fl-builder' ), '{{data.moduleName}}' ); ?></a></li>
						</ul>
					</span>

					<# if ( ! data.isRootModule && ! FLBuilderConfig.simpleUi ) { #>
						<i class="fl-block-copy far fa-clone fl-tip" title="<?php _e( 'Duplicate', 'fl-builder' ); ?>"></i>
						<# if ( data.parentMenu ) { #>
							<span class="fl-builder-has-submenu fl-builder-submenu-hover">
								<svg width="20" height="20" class="fl-block-select-parent fl-tip" title="<?php _e( 'Select Parent', 'fl-builder' ); ?>">
									<path d="M1.38672 5.33984C2.1582 5.33984 2.77344 4.72461 2.77344 3.95312C2.77344 3.19141 2.1582 2.56641 1.38672 2.56641C0.625 2.56641 0 3.19141 0 3.95312C0 4.72461 0.625 5.33984 1.38672 5.33984ZM5.97656 4.89062H14.0565C14.5838 4.89062 15.0038 4.48047 15.0038 3.95312C15.0038 3.42578 14.5936 3.01562 14.0565 3.01562H5.97656C5.45898 3.01562 5.03906 3.42578 5.03906 3.95312C5.03906 4.48047 5.44922 4.89062 5.97656 4.89062ZM3.88672 11.3457C4.64844 11.3457 5.27344 10.7305 5.27344 9.95898C5.27344 9.19727 4.64844 8.57227 3.88672 8.57227C3.11523 8.57227 2.49023 9.19727 2.49023 9.95898C2.49023 10.7305 3.11523 11.3457 3.88672 11.3457ZM8.47656 10.8965H16.5794C17.1068 10.8965 17.5169 10.4863 17.5169 9.95898C17.5169 9.43164 17.1068 9.02148 16.5794 9.02148H8.47656C7.94922 9.02148 7.53906 9.43164 7.53906 9.95898C7.53906 10.4863 7.94922 10.8965 8.47656 10.8965ZM6.37695 17.3516C7.14844 17.3516 7.76367 16.7363 7.76367 15.9648C7.76367 15.2031 7.14844 14.5781 6.37695 14.5781C5.61523 14.5781 4.99023 15.2031 4.99023 15.9648C4.99023 16.7363 5.61523 17.3516 6.37695 17.3516ZM10.9668 16.9023H19.0251C19.5524 16.9023 19.9626 16.4922 19.9626 15.9648C19.9626 15.4375 19.5524 15.0273 19.0251 15.0273H10.9668C10.4395 15.0273 10.0293 15.4375 10.0293 15.9648C10.0293 16.4922 10.4395 16.9023 10.9668 16.9023Z" fill="currentColor"></path>
								</svg>
								<ul class="fl-builder-submenu fl-block-select-parent-menu">
									<# for( var i in data.parentMenu ) {
										var margin = i < 2 ? 0 : ( i * 12 ) - 12;
									#>
										<li class="fl-builder-has-submenu">
											<a href="javascript:void(0);" data-target-node="{{data.parentMenu[i].node}}" class="fl-builder-submenu-link">
												<span style="margin-left:{{margin}}px;">
													<# if ( i > 0 ) { #>
														<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="12px" width="12px">
															<path d="M5 6l5 5 5-5 2 1-7 7-7-7z"></path>
														</svg>
													<# } #>
													{{data.parentMenu[i].name}}
													<i class="fas fa-caret-right"></i>
												</span>
											</a>
											<ul class="fl-builder-submenu">
												<li>
													<a class="fl-builder-submenu-link fl-block-settings" data-target-node="{{data.parentMenu[i].node}}" href="javascript:void(0);">
														<?php /* translators: %s: Node type */ ?>
														<?php printf( __( '%s Settings', 'fl-builder' ), '{{data.parentMenu[i].name}}' ); ?>
													</a>
												</li>
												<li>
													<a class="fl-builder-submenu-link fl-{{data.parentMenu[i].type}}-move" data-target-node="{{data.parentMenu[i].node}}" href="javascript:void(0);">
														<?php /* translators: %s: Node type */ ?>
														<?php printf( __( 'Move %s', 'fl-builder' ), '{{data.parentMenu[i].name}}' ); ?>
													</a>
												</li>
												<li>
													<a class="fl-builder-submenu-link fl-block-copy" data-target-node="{{data.parentMenu[i].node}}" href="javascript:void(0);">
														<?php /* translators: %s: Node type */ ?>
														<?php printf( __( 'Duplicate %s', 'fl-builder' ), '{{data.parentMenu[i].name}}' ); ?>
													</a>
												</li>
												<li>
													<a class="fl-builder-submenu-link fl-block-remove" data-target-node="{{data.parentMenu[i].node}}" href="javascript:void(0);">
														<?php /* translators: %s: Node type */ ?>
														<?php printf( __( 'Remove %s', 'fl-builder' ), '{{data.parentMenu[i].name}}' ); ?>
													</a>
												</li>
											</ul>
										</li>
									<# } #>
								</ul>
							</span>
						<# } #>

						<span class="fl-block-remove fl-tip" title="<?php _e( 'Remove', 'fl-builder' ); ?>">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path d="M16 4L4 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
								<path d="M4 4L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
							</svg>
						</span>
					<# } #>
				<# } #>
			</div>
			<div class="fl-clear"></div>
		</div>

		<# if ( data.nodeLabel && ! FLBuilderConfig.node_labels_disabled ) { #>
			<span class="fl-block-label<# if ( data.hasRules ) { #> fl-block-label-has-rules<# } #>">{{data.nodeLabel}}</span>
		<# } #>

		<# if ( data.colHasRules ) { #>
			<i class="fas fa-eye fl-tip fl-block-has-rules {{data.rulesTypeCol}}" title="<?php _e( 'This column has visibility rules', 'fl-builder' ); ?>: {{data.rulesTextCol}}"></i>
		<# } else if ( data.hasRules ) { #>
			<i class="fas fa-eye fl-tip fl-block-has-rules {{data.rulesTypeModule}}" title="<?php _e( 'This module has visibility rules', 'fl-builder' ); ?>: {{data.rulesTextModule}}"></i>
		<# } #>

		<?php if ( ! FLBuilderModel::is_post_user_template( 'module' ) && ! $simple_ui ) : ?>
			<# if ( ! data.groupLoading && ! data.isRootCol && data.numCols > 0 ) { #>
				<# if ( ! data.colFirst || ( data.hasParentCol && data.colFirst && ! data.parentFirst ) ) { #>
					<div class="fl-block-col-resize fl-block-col-resize-w<# if ( data.hasParentCol && data.colFirst && ! data.parentFirst ) { #> fl-block-col-resize-parent<# } #>">
						<div class="fl-block-col-resize-handle-wrap">
							<div class="fl-block-col-resize-feedback fl-block-col-resize-feedback-left"></div>
							<div class="fl-block-col-resize-handle"></div>
							<div class="fl-block-col-resize-feedback fl-block-col-resize-feedback-right"></div>
						</div>
					</div>
				<# } #>
				<# if ( ! data.colLast || ( data.hasParentCol && data.colLast && ! data.parentLast ) ) { #>
					<div class="fl-block-col-resize fl-block-col-resize-e<# if ( data.hasParentCol && data.colLast && ! data.parentLast ) { #> fl-block-col-resize-parent<# } #>">
						<div class="fl-block-col-resize-handle-wrap">
							<div class="fl-block-col-resize-feedback fl-block-col-resize-feedback-left"></div>
							<div class="fl-block-col-resize-handle"></div>
							<div class="fl-block-col-resize-feedback fl-block-col-resize-feedback-right"></div>
						</div>
					</div>
				<# } #>
			<# } #>
			<# if ( data.userCanResizeRows ) { #>
				<# if ( ( ( data.colFirst && ! data.hasParentCol ) || ( data.colFirst && data.parentFirst ) ) && data.rowIsFixedWidth ) { #>
					<div class="fl-block-row-resize fl-block-col-resize fl-block-col-resize-w">
						<div class="fl-block-col-resize-handle-wrap">
							<div class="fl-block-col-resize-feedback fl-block-col-resize-feedback-left"></div>
							<div class="fl-block-col-resize-handle"></div>
							<div class="fl-block-col-resize-feedback fl-block-col-resize-feedback-right"></div>
						</div>
					</div>
				<# } #>
				<# if ( ( ( data.colLast && ! data.hasParentCol ) || ( data.colLast && data.parentLast ) ) && data.rowIsFixedWidth ) { #>
					<div class="fl-block-row-resize fl-block-col-resize fl-block-col-resize-e">
						<div class="fl-block-col-resize-handle-wrap">
							<div class="fl-block-col-resize-feedback fl-block-col-resize-feedback-left"></div>
							<div class="fl-block-col-resize-handle"></div>
							<div class="fl-block-col-resize-feedback fl-block-col-resize-feedback-right"></div>
						</div>
					</div>
				<# } #>
			<# } #>
		<?php endif; ?>
	</div>
</script>
<!-- #tmpl-fl-module-overlay -->

<script type="text/html" id="tmpl-fl-overlay-overflow-menu">
	<span class="fl-builder-has-submenu fl-builder-submenu-hover">
		<i class="fl-block-overflow-menu fas fa-bars fl-tip" title="<?php _e( 'More', 'fl-builder' ); ?>"></i>
		<ul class="fl-builder-submenu">
			<# for( var i = 0; i < data.length; i++ ) { #>
				<# if ( 'submenu' == data[ i ].type ) { #>
					<li class="fl-builder-has-submenu"><a href="javascript:void(0);" class="{{data[ i ].className}}">{{data[ i ].label}}<i class="fas fa-caret-right"></i></a>
						{{{data[ i ].submenu}}}
					</li>
				<# } else { #>
					<li><a class="{{data[ i ].className}}" href="javascript:void(0);">{{data[ i ].label}}<# if ( data[ i ].className.indexOf( 'fl-block-move' ) > -1 ) { #><i class="fas fa-arrows-alt"></i><# } #></a>
				<# } #>
			<# } #>
		</ul>
	</span>
</script>
<!-- #tmpl-fl-overlay-overflow-menu -->
